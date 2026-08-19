import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useVendors } from '../context/VendorContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Star, Clock, MapPin, ArrowLeft, Heart, Navigation, Plus, Minus, ShieldCheck, Share2, Utensils, Compass } from 'lucide-react';

// Lazy-load the heavy Leaflet map modal so it doesn't crash VendorDetailsPage on import
const LiveRouteTrackerModal = lazy(() =>
  import('../components/customer/LiveRouteTrackerModal').then(m => ({ default: m.LiveRouteTrackerModal }))
);

export const VendorDetailsPage = ({ vendor, onBack }) => {
  const { getMenuItemsByVendor, fetchMenuItems, vendors } = useVendors();
  const { cartItems, addToCart, removeFromCart, getItemQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showLiveTracker, setShowLiveTracker] = useState(false);

  // Safe vendor fallback object to prevent blank screen crashes
  const v = vendor || vendors?.[0] || {
    id: 'v_1',
    name: 'Famous Street Food Stall',
    category: 'Vada Pav, Chaat & Dosa',
    rating: 4.6,
    reviewCount: 180,
    distance: '0.3 km',
    address: 'Indiranagar, Bangalore',
    description: 'Famous for authentic Mumbai style Vada Pav and street snacks. Prepared fresh with quality ingredients everyday!',
    banner: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    coordinates: [12.9716, 77.5946]
  };

  const vendorId = v.id || v._id || 'v_1';

  useEffect(() => {
    if (vendorId) {
      fetchMenuItems(vendorId);
    }
  }, [vendorId]);

  const menuItems = getMenuItemsByVendor(vendorId) || [];
  const fav = isFavorite(vendorId);

  const getItemQty = (itemId) => getItemQuantity ? getItemQuantity(itemId) : 0;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 pb-28 animate-fade-in">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-white bg-[#1E293B] px-4 py-2.5 rounded-xl border border-slate-700 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery</span>
        </button>

        {/* RESPONSIVE LAYOUT: 2-COLUMN ON DESKTOP (md:grid-cols-12), STACKED ON MOBILE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: VENDOR HERO & DETAILS (5 Cols on md+) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Hero Image Container */}
            <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              <img
                src={v.banner || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'}
                alt={v.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80';
                }}
              />
              
              {/* Overlay Favorite Heart */}
              <button
                onClick={() => toggleFavorite(vendorId)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center text-slate-200 hover:text-red-500 shadow-md border border-slate-700"
              >
                <Heart className={`w-5 h-5 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Vendor Main Info Card */}
            <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
              
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-white">{v.name}</h1>
                  <p className="text-xs text-slate-400">{v.category || 'Vada Pav, Batata Vada'}</p>
                </div>

                <div className="flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-xl text-xs font-bold border border-emerald-500/30">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{v.rating || 4.6}</span>
                  <span className="text-slate-500 font-normal">({v.reviewCount || 256})</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{v.distance || '0.2 km'} • {v.address || 'Indiranagar, Bangalore'}</span>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-xs font-semibold text-emerald-400">Open Now</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">Closes 11:00 PM</span>
                  <span className="ml-auto inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Vendor</span>
                  </span>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-bold text-white">About the Stall</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {v.description || 'Famous for authentic Mumbai style Vada Pav and street snacks. Prepared fresh with quality ingredients everyday!'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={() => setShowLiveTracker(true)}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg transition-all flex items-center justify-center space-x-2 group"
                >
                  <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  <span>Live Location & Route</span>
                </button>

                <button
                  onClick={() => {
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.name)}`, '_blank');
                  }}
                  className="p-3.5 rounded-2xl bg-[#0F172A] border border-slate-700 text-slate-300 hover:text-emerald-400"
                  title="Google Maps"
                >
                  <Navigation className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: v.name, text: `Check out ${v.name} on VINDIGO!`, url: window.location.href });
                    }
                  }}
                  className="p-3.5 rounded-2xl bg-[#0F172A] border border-slate-700 text-slate-300 hover:text-emerald-400"
                  title="Share Stall"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: FOOD MENU ITEMS (7 Cols on md+) */}
          <div className="md:col-span-7 space-y-4">
            
            <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Utensils className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Stall Menu</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">{menuItems.length} items available</span>
              </div>

              {menuItems.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Menu items loading or no items listed yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {menuItems.map((item) => {
                    const qty = getItemQty(item.id || item._id);

                    return (
                      <div key={item.id || item._id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="flex items-center space-x-3">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" />
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className={item.isVeg !== false ? 'veg-indicator' : 'nonveg-indicator'} />
                              <h4 className="text-sm font-bold text-white">{item.name}</h4>
                            </div>
                            <p className="text-xs font-bold text-emerald-400">₹{item.price}</p>
                          </div>
                        </div>

                        {/* Stepper Button */}
                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(item, v)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg transition-all flex items-center space-x-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span>ADD</span>
                          </button>
                        ) : (
                          <div className="flex items-center space-x-3 bg-[#0F172A] px-3 py-1.5 rounded-xl border border-slate-700">
                            <button
                              onClick={() => removeFromCart(item.id || item._id)}
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-bold text-white w-4 text-center">{qty}</span>
                            <button
                              onClick={() => addToCart(item, v)}
                              className="p-1 text-emerald-400 hover:text-emerald-300 font-bold"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Live Route Tracker Modal - lazy loaded so it doesn't crash the page */}
      {showLiveTracker && (
        <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading map…</div>}>
          <LiveRouteTrackerModal
            vendor={v}
            onClose={() => setShowLiveTracker(false)}
          />
        </Suspense>
      )}

    </div>
  );
};
