import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vendigo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('vendigo_token') || null;
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('vendigo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vendigo_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('vendigo_token', token);
    } else {
      localStorage.removeItem('vendigo_token');
    }
  }, [token]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const login = async (email, password, role = 'customer') => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        showToast(data.message || 'Login failed', 'error');
        return { success: false, message: data.message };
      }
      
      setUser(data.user);
      setToken(data.token);
      showToast(`Welcome back, ${data.user.name}! Logged in as ${data.user.role.toUpperCase()}`);
      return { success: true, user: data.user };
    } catch (error) {
      // Server offline – use demo/offline mode
      console.warn('Server offline, using demo login:', error.message);
      const demoUser = {
        id: 'demo_' + Date.now(),
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email,
        role,
        phone: '',
        address: 'Bangalore, India',
      };
      setUser(demoUser);
      setToken('demo_token_' + Date.now());
      showToast(`Welcome back, ${demoUser.name}! (Offline demo mode)`);
      return { success: true, user: demoUser };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        showToast(data.message || 'Registration failed', 'error');
        return { success: false, message: data.message };
      }
      
      setUser(data.user);
      setToken(data.token);
      showToast(`Registration successful! Welcome to VENDIGO, ${data.user.name}`);
      return { success: true, user: data.user };
    } catch (error) {
      // Server offline – use demo/offline mode
      console.warn('Server offline, using demo register:', error.message);
      const demoUser = {
        id: 'demo_' + Date.now(),
        name: userData.name || userData.email?.split('@')[0] || 'User',
        email: userData.email,
        role: userData.role || 'customer',
        phone: userData.phone || '',
        address: userData.address || 'Bangalore, India',
      };
      setUser(demoUser);
      setToken('demo_token_' + Date.now());
      showToast(`Welcome to VENDIGO, ${demoUser.name}! (Offline demo mode)`);
      return { success: true, user: demoUser };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = async (updatedData) => {
    // For demo purposes and profile updating, we update locally and can send to server if token is present
    setUser(prev => {
      const next = { ...prev, ...updatedData };
      showToast('Profile updated successfully');
      return next;
    });
  };

  // Support switching role for debugging (logs in with seeded accounts)
  const switchRole = async (newRole) => {
    if (newRole === 'customer') {
      await login('customer@vendigo.com', 'customer123', 'customer');
    } else if (newRole === 'vendor') {
      // Find a vendor account from seeded data
      await login('dahisar.vadapav@vendigo.com', 'vendor123', 'vendor');
    } else if (newRole === 'admin') {
      await login('admin@vendigo.com', 'admin123', 'admin');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        role: user?.role || 'customer',
        login,
        register,
        logout,
        updateProfile,
        switchRole,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
