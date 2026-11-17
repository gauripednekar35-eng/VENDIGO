import React from 'react';
import { Home, Map, Heart, User, LayoutDashboard, Search, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const isVendor = user?.role === 'vendor';

  const customerTabs = [
    { id: 'home',      label: 'Home',    icon: Home },
    { id: 'search',    label: 'Explore', icon: Search },
    { id: 'map',       label: 'Map',     icon: Map },
    { id: 'favorites', label: 'Saved',   icon: Heart },
    { id: 'profile',   label: 'Profile', icon: User },
  ];

  const vendorTabs = [
    { id: 'vendor-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const navItems = isVendor ? vendorTabs : customerTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-surface/95 backdrop-blur-xl border-t border-slate-800/80 shadow-bottom-nav">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 font-medium hover:text-slate-300'
              }`}
            >
              <div className={`relative ${isActive ? 'p-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        {/* Cart button — only for customers */}
        {!isVendor && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-2xl transition-all text-slate-500 font-medium hover:text-orange relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 stroke-2" />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-orange text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-lg animate-bounce-once">
                  {totalCount > 99 ? '99+' : totalCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Cart</span>
          </button>
        )}
      </div>
    </nav>
  );
};
