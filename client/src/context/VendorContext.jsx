import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_VENDORS, INITIAL_MENU_ITEMS } from '../data/mockData';

const VendorContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch approved vendors from API
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/vendors`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const apiIds = new Set(data.map(v => v.id || v._id));
          const mockNonDuplicates = INITIAL_VENDORS.filter(v => !apiIds.has(v.id));
          setVendors([...data, ...mockNonDuplicates]);
        } else {
          loadMockVendors();
        }
      } else {
        loadMockVendors();
      }
    } catch (error) {
      console.error('Error fetching vendors from API:', error);
      loadMockVendors();
    } finally {
      setLoading(false);
    }
  };

  const loadMockVendors = () => {
    const saved = localStorage.getItem('vendigo_vendors');
    if (saved) {
      try {
        setVendors(JSON.parse(saved));
      } catch {
        setVendors(INITIAL_VENDORS);
      }
    } else {
      setVendors(INITIAL_VENDORS);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Save to localStorage as a cache fallback
  useEffect(() => {
    if (vendors.length > 0) {
      localStorage.setItem('vendigo_vendors', JSON.stringify(vendors));
    }
  }, [vendors]);

  useEffect(() => {
    if (menuItems.length > 0) {
      localStorage.setItem('vendigo_menu_items', JSON.stringify(menuItems));
    }
  }, [menuItems]);

  // Vendor Operations
  const toggleVendorOpen = async (vendorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/toggle-open`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, isOpen: data.isOpen } : v));
      } else {
        // Local fallback
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, isOpen: !v.isOpen } : v));
      }
    } catch {
      setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, isOpen: !v.isOpen } : v));
    }
  };

  const approveVendor = async (vendorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/approve-vendor/${vendorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, isApproved: true } : v));
      } else {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, isApproved: true } : v));
      }
    } catch {
      setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, isApproved: true } : v));
    }
  };

  const deleteVendor = async (vendorId) => {
    setVendors(prev => prev.filter(v => v.id !== vendorId));
    setMenuItems(prev => prev.filter(m => m.vendorId !== vendorId));
  };

  const updateVendorDetails = async (vendorId, updatedFields) => {
    // Sync locally
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...updatedFields } : v));
  };

  const registerVendorShop = async (shopData) => {
    const newVendor = {
      name: shopData.name,
      ownerName: shopData.ownerName,
      phone: shopData.phone,
      email: shopData.email,
      rating: 4.5,
      reviewCount: 1,
      distance: '1.0 km',
      prepTime: '15-20 min',
      address: shopData.address,
      coordinates: [19.2500, 72.8590], // Default Dahisar coordinates
      category: shopData.category || 'vada-pav',
      isOpen: true,
      isApproved: false,
      priceForTwo: shopData.priceForTwo || '₹150 for two',
      banner: shopData.banner || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      logo: shopData.logo || 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=200&q=80',
      description: shopData.description || 'Delicious local street food stall.',
      tags: shopData.tags || ['Street Food', 'Snacks']
    };

    try {
      const response = await fetch(`${API_BASE_URL}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor)
      });
      if (response.ok) {
        const data = await response.json();
        setVendors(prev => [data, ...prev]);
        return data;
      }
    } catch (err) {
      console.error('Failed to register vendor on server:', err);
    }

    // Local fallback
    const localVendor = { id: 'v_' + Date.now(), ...newVendor };
    setVendors(prev => [localVendor, ...prev]);
    return localVendor;
  };

  // Menu Operations
  const fetchMenuItems = async (vendorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/menu`);
      if (response.ok) {
        const data = await response.json();
        setMenuItems(prev => {
          const filtered = prev.filter(m => m.vendorId !== vendorId);
          return [...filtered, ...data];
        });
      }
    } catch (error) {
      console.error('Failed to fetch menu items from API:', error);
    }
  };

  const getMenuItemsByVendor = (vendorId) => {
    // If we have local state, filter it. It gets loaded by fetchMenuItems.
    const filtered = menuItems.filter(m => m.vendorId === vendorId);
    if (filtered.length > 0) return filtered;
    
    // Fallback to cache
    const saved = localStorage.getItem('vendigo_menu_items');
    let localItems = INITIAL_MENU_ITEMS;
    if (saved) {
      try {
        localItems = JSON.parse(saved);
      } catch {}
    }
    return localItems.filter(m => m.vendorId === vendorId);
  };

  const addMenuItem = async (itemData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (response.ok) {
        const data = await response.json();
        setMenuItems(prev => [data, ...prev]);
        return data;
      }
    } catch (err) {
      console.error('Failed to add menu item:', err);
    }

    // Local fallback
    const newItem = {
      id: 'm_' + Date.now(),
      vendorId: itemData.vendorId,
      name: itemData.name,
      price: Number(itemData.price),
      category: itemData.category || 'Snacks',
      isVeg: itemData.isVeg !== undefined ? itemData.isVeg : true,
      isAvailable: true,
      image: itemData.image || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
      description: itemData.description || 'Tasty authentic street food dish.'
    };
    setMenuItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateMenuItem = async (itemId, updatedFields) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (response.ok) {
        const data = await response.json();
        setMenuItems(prev => prev.map(m => m.id === itemId ? data : m));
        return;
      }
    } catch (err) {
      console.error('Failed to update menu item on server:', err);
    }

    // Local fallback
    setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, ...updatedFields } : m));
  };

  const deleteMenuItem = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/${itemId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setMenuItems(prev => prev.filter(m => m.id !== itemId));
        return;
      }
    } catch (err) {
      console.error('Failed to delete menu item on server:', err);
    }

    setMenuItems(prev => prev.filter(m => m.id !== itemId));
  };

  const toggleMenuItemAvailability = async (itemId) => {
    const item = menuItems.find(m => m.id === itemId);
    if (item) {
      await updateMenuItem(itemId, { isAvailable: !item.isAvailable });
    }
  };

  const getVendorById = (vendorId) => {
    return vendors.find(v => v.id === vendorId);
  };

  return (
    <VendorContext.Provider
      value={{
        vendors,
        menuItems,
        loading,
        fetchVendors,
        fetchMenuItems,
        toggleVendorOpen,
        approveVendor,
        deleteVendor,
        updateVendorDetails,
        registerVendorShop,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemAvailability,
        getMenuItemsByVendor,
        getVendorById
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useVendors = () => useContext(VendorContext);
