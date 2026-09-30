import React, { useState, useEffect, Component } from 'react';

// Error Boundary to catch crashes and show a useful message instead of blank screen
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('❌ VendorDetailsPage crashed:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0B0F17', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 style={{ color: '#f87171', fontWeight: 'bold' }}>Something went wrong loading the stall page</h2>
          <pre style={{ background: '#1e293b', padding: 12, borderRadius: 8, fontSize: 11, maxWidth: 600, overflow: 'auto', color: '#94a3b8' }}>{this.state.error?.message}</pre>
          <button onClick={() => this.setState({ hasError: false, error: null })} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer' }}>← Go Back</button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { VendorProvider } from './context/VendorContext';
import { OrderProvider } from './context/OrderContext';
import { FavoritesProvider } from './context/FavoritesContext';

import { DesktopNavbar } from './components/common/DesktopNavbar';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { VendorMismatchModal } from './components/common/VendorMismatchModal';
import { CartDrawer } from './components/customer/CartDrawer';

import { SplashScreen } from './pages/SplashScreen';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { MapPage } from './pages/MapPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { VendorDetailsPage } from './pages/VendorDetailsPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { VendorDashboardPage } from './pages/VendorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthPage } from './pages/AuthPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppContent = () => {
  const { user } = useAuth();
  
  // Quick splash check (session storage so returning visits are instant)
  const [showSplash, setShowSplash] = useState(true);

  const [activeTab, setActiveTab] = useState('home');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Redirect to auth page when user logs out
  useEffect(() => {
    if (!user && !showSplash && activeTab !== 'auth') {
      setActiveTab('auth');
    }
  }, [user]);

  const handleSelectVendor = (vendor) => {
    console.log('🏪 handleSelectVendor called with:', vendor);
    if (!vendor) { console.warn('⚠️ vendor is null/undefined'); return; }
    const vendorWithId = {
      ...vendor,
      id: vendor.id || vendor._id || 'v_default'
    };
    console.log('✅ Setting selectedVendor:', vendorWithId);
    setSelectedVendor(vendorWithId);
    setActiveTab('vendor-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishSplash = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleFinishSplash} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 relative">
      
      {/* DESKTOP NAVBAR (Visible on laptop/desktop screens md+) */}
      {activeTab !== 'auth' && (
        <DesktopNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      )}

      {/* MAIN CONTENT AREA (non-map pages) */}
      {activeTab !== 'map' && (
      <main className="pb-16 md:pb-6">
        {activeTab === 'home' && (
          <HomePage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onSelectVendor={handleSelectVendor}
            onNavigateToSearch={() => setActiveTab('search')}
          />
        )}

        {activeTab === 'search' && (
          <SearchPage
            selectedLocation={selectedLocation}
            onSelectVendor={handleSelectVendor}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesPage
            onSelectVendor={handleSelectVendor}
            onExplore={() => setActiveTab('home')}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'vendor-details' && (
          <ErrorBoundary>
            <VendorDetailsPage
              vendor={selectedVendor}
              onBack={() => setActiveTab('home')}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'orders' && (
          <OrdersPage
            onExploreMore={() => setActiveTab('home')}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            onLoginClick={() => setActiveTab('auth')}
          />
        )}

        {activeTab === 'vendor-dashboard' && (
          <VendorDashboardPage />
        )}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboardPage />
        )}

        {activeTab === 'auth' && (
          <AuthPage
            onAuthSuccess={(userRole) => {
              if (userRole === 'vendor') setActiveTab('vendor-dashboard');
              else if (userRole === 'admin') setActiveTab('admin-dashboard');
              else setActiveTab('home');
            }}
          />
        )}

        {activeTab === '404' && (
          <NotFoundPage onGoHome={() => setActiveTab('home')} />
        )}
      </main>
      )} {/* end non-map pages */}

      {/* MAP PAGE - Full viewport on mobile, sits below DesktopNavbar on desktop */}
      {activeTab === 'map' && (
        <div className="fixed inset-0 md:top-[72px] z-40">
          <MapPage
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onSelectVendor={handleSelectVendor}
            onBack={() => setActiveTab('home')}
          />
        </div>
      )}

      {/* MOBILE BOTTOM NAV (Visible on mobile screens < md) */}
      {activeTab !== 'auth' && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <CartDrawer onOrderPlaced={() => setActiveTab('orders')} />
      <Toast />
      <VendorMismatchModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <VendorProvider>
        <CartProvider>
          <OrderProvider>
            <FavoritesProvider>
              <AppContent />
            </FavoritesProvider>
          </OrderProvider>
        </CartProvider>
      </VendorProvider>
    </AuthProvider>
  );
}
