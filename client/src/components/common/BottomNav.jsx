import React from 'react';
import { Home, Map, Heart, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const isVendor = user?.role === 'vendor';

  const customerTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
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
      </div>
    </nav>
  );
};
