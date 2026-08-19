import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { MUMBAI_LOCATIONS } from '../../data/mockData';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  User, 
  Store, 
  ShieldCheck, 
  LogOut, 
  ChevronDown,
  Menu,
  X,
  Compass,
  Sparkles
} from 'lucide-react';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery, 
  selectedLocation, 
  setSelectedLocation 
}) => {
  const { user, role, logout, switchRole } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const currentLocationName = MUMBAI_LOCATIONS.find(l => l.id === selectedLocation)?.name || 'Dahisar West';

  return (
    <header className="sticky top-0 z-40 glass-nav shadow-subtle transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Location Selector */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center space-x-2 group focus:outline-none"
            >
              <img 
                src="/logo.png" 
                alt="VENDIGO Logo" 
                className="w-11 h-11 rounded-2xl object-cover group-hover:scale-105 transition-transform"
              />
              <div className="text-left">
                <span className="text-2xl font-extrabold tracking-tight text-brand-darkText flex items-center gap-1">
                  VEND<span className="text-primary">IGO</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                </span>
                <span className="block text-[10px] font-semibold text-secondary uppercase tracking-widest -mt-1">
                  Mumbai Street Food Hub
                </span>
              </div>
            </button>

            {/* Location Selector Pill */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-brand-darkText transition-colors text-xs font-bold border border-slate-200"
            >
              <MapPin className="w-4 h-4 text-primary shrink-0 animate-bounce" />
              <span className="truncate max-w-[140px] text-slate-900">{currentLocationName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Center Search Bar */}
          {role === 'customer' && activeTab === 'home' && (
            <div className="hidden lg:flex flex-1 max-w-md mx-6 relative">
              <input
                type="text"
                placeholder="Search Dahisar vada pav, sandwich, dosa, frankie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100/90 border border-transparent focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Right Action Icons & Role Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Quick Demo Role Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200">
              <button
                onClick={() => { switchRole('customer'); setActiveTab('home'); }}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all ${
                  role === 'customer' ? 'bg-primary text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>

              <button
                onClick={() => { switchRole('vendor'); setActiveTab('vendor-dashboard'); }}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all ${
                  role === 'vendor' ? 'bg-secondary text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Vendor</span>
              </button>

              <button
                onClick={() => { switchRole('admin'); setActiveTab('admin-dashboard'); }}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all ${
                  role === 'admin' ? 'bg-slate-900 text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Role Specific Navigation */}
            {role === 'customer' && (
              <>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'orders' ? 'text-primary bg-primary/10' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Orders</span>
                </button>

                {/* Cart Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 rounded-xl bg-primary-50 text-primary hover:bg-primary-100 transition-colors focus:outline-none"
                  title="View Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-orange-glow animate-bounce">
                      {totalCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-subtle transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-dark font-bold flex items-center justify-center text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left leading-tight hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[100px]">{user.name}</p>
                    <p className="text-[10px] font-medium text-slate-500 capitalize">{role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => { setActiveTab('profile'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile & Settings</span>
                    </button>

                    {role === 'customer' && (
                      <button
                        onClick={() => { setActiveTab('orders'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-400" />
                        <span>Order History</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md transition-all"
              >
                Sign In
              </button>
            )}

          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center space-x-2">
            {role === 'customer' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-xl bg-primary-50 text-primary"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Switch View Role</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { switchRole('customer'); setActiveTab('home'); setMobileMenuOpen(false); }}
                className={`py-2 rounded-lg text-xs font-bold text-center ${role === 'customer' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                Customer
              </button>
              <button
                onClick={() => { switchRole('vendor'); setActiveTab('vendor-dashboard'); setMobileMenuOpen(false); }}
                className={`py-2 rounded-lg text-xs font-bold text-center ${role === 'vendor' ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                Vendor
              </button>
              <button
                onClick={() => { switchRole('admin'); setActiveTab('admin-dashboard'); setMobileMenuOpen(false); }}
                className={`py-2 rounded-lg text-xs font-bold text-center ${role === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2">
            {role === 'customer' && (
              <>
                <button
                  onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Discover Vendors
                </button>
                <button
                  onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  My Orders
                </button>
              </>
            )}

            {user && (
              <button
                onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Profile & Settings
              </button>
            )}
          </div>
        </div>
      )}

      {/* Location Selector Modal for Mumbai & Dahisar */}
      {locationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Select Mumbai Location / Suburb
              </h3>
              <button onClick={() => setLocationModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">Discover local authentic street stalls near your specific Mumbai neighborhood.</p>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {MUMBAI_LOCATIONS.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocation(loc.id);
                    setLocationModalOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs transition-all border flex items-center justify-between ${
                    selectedLocation === loc.id
                      ? 'border-primary bg-primary-50 text-primary-dark font-extrabold shadow-sm'
                      : 'border-slate-100 hover:border-slate-300 text-slate-700 bg-slate-50/50 font-medium'
                  }`}
                >
                  <div>
                    <span className="block text-slate-900 font-bold">{loc.name}</span>
                    <span className="text-[10px] text-slate-500">{loc.area}</span>
                  </div>
                  {selectedLocation === loc.id && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">Selected</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
