import React from 'react';
import { useVendors } from '../context/VendorContext';
import { useFavorites } from '../context/FavoritesContext';
import { Star, Heart, MoreVertical, MapPin, ShoppingBag } from 'lucide-react';

export const FavoritesPage = ({ onSelectVendor, onExplore }) => {
  const { vendors } = useVendors();
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteVendors = vendors.filter(v => favorites.includes(v.id));

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 pb-24 pt-6 px-4 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-black text-white">My Favorites</h1>
          <p className="text-xs text-slate-400">Your saved street food stalls & vendors</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          {favoriteVendors.length} Saved
        </span>
      </div>

      {favoriteVendors.length === 0 ? (
        <div className="bg-dark-card rounded-3xl p-10 text-center border border-slate-800/80 max-w-md mx-auto space-y-4 my-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Favorites Saved Yet</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Tap the heart icon on any street vendor to save them to your list!
            </p>
          </div>
          <button
            onClick={onExplore}
            className="px-6 py-3 rounded-2xl bg-emerald-500 text-white text-xs font-bold shadow-emerald-glow hover:bg-emerald-600 transition-all inline-flex items-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Vendors</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteVendors.map((vendor) => (
            <div
              key={vendor.id}
              onClick={() => onSelectVendor(vendor)}
              className="bg-dark-card rounded-2xl p-4 border border-slate-800/80 shadow-card hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <img
                  loading="lazy"
                  src={vendor.banner || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80'}
                  alt={vendor.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                />

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {vendor.name}
                  </h4>
                  
                  <div className="flex items-center space-x-1 text-xs text-slate-300">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold">{vendor.rating || 4.6}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                    <span>{vendor.distance || '0.2 km'}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">Open Now</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(vendor.id);
                  }}
                  className="p-2 text-red-500 hover:scale-110 transition-transform"
                >
                  <Heart className="w-5 h-5 fill-red-500" />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-slate-500 hover:text-slate-300"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
