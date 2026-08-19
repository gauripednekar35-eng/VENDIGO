import React from 'react';
import { Home, Search, Map, Heart, User, ShoppingBag, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { VindigoLogo } from './VindigoLogo';
import { CustomLocationDropdown } from './CustomLocationDropdown';

export const DesktopNavbar = ({
  activeTab,
  setActiveTab,
  selectedLocation,
  setSelectedLocation
}) => {
  const { user } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const isVendor = user?.role === 'vendor';

  const locations = [
    { id: 'indiranagar', name: 'Indiranagar, Bangalore' },
    { id: 'dahisar-w', name: 'Dahisar West, Mumbai' },
    { id: 'bandra-w', name: 'Bandra West, Mumbai' },
    { id: 'koramangala', name: 'Koramangala, Bangalore' }
  ];

  const navLinks = isVendor
    ? [
        { id: 'vendor-dashboard', label: 'Dashboard', icon: Home },
        { id: 'search', label: 'Explore Vendors', icon: Search },
        { id: 'map', label: 'Vendor Map', icon: Map },
        { id: 'profile', label: 'Account', icon: User },
      ]
    : [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'search', label: 'Explore', icon: Search },
        { id: 'map', label: 'Map View', icon: Map },
        { id: 'favorites', label: 'Favorites', icon: Heart },
        { id: 'orders', label: 'My Orders', icon: ShoppingBag },
      ];

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-[#0F172A] border-b border-slate-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        
        {/* Exact VINDIGO Logo */}
        <div
          onClick={() => setActiveTab(isVendor ? 'vendor-dashboard' : 'home')}
          className="cursor-pointer group hover:scale-105 transition-transform"
        >
          <VindigoLogo size="md" showTagline={true} />
        </div>

        {/* Custom Location Picker Dropdown */}
        <CustomLocationDropdown
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />



        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Cart & Profile */}
        <div className="flex items-center space-x-3">
          
          {/* Cart Button */}
          {!isVendor && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#1E293B] border border-slate-600 text-slate-200 hover:text-white hover:border-emerald-500 transition-all flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="bg-orange text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {totalCount}
                </span>
              )}
            </button>
          )}

          {/* User Badge / Sign In */}
          {user ? (
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-2.5 bg-[#1E293B] px-3.5 py-1.5 rounded-xl border border-slate-600 hover:border-emerald-500 transition-all shrink-0"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-white whitespace-nowrap">{user.name}</p>
                <span className="text-[9px] text-emerald-400 font-bold uppercase block -mt-0.5">{user.role}</span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
            >
              Sign In
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
