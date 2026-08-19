import React, { useState } from 'react';
import { useVendors } from '../context/VendorContext';
import { useFavorites } from '../context/FavoritesContext';
import { TopHeader } from '../components/common/TopHeader';
import { matchVendorLocation } from '../utils/locationHelper';
import { Search, SlidersHorizontal, Star, MapPin, Heart, ChevronRight, Utensils, Coffee, Pizza, Sparkles, ArrowRight, X, Check } from 'lucide-react';

export const HomePage = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  onSelectVendor,
  onNavigateToSearch
}) => {
  const { vendors, loading } = useVendors();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Filter panel state
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(0); // 0 = any
  const [filterFoodType, setFilterFoodType] = useState('all'); // all, veg, nonveg

  const activeFilterCount = [
    filterOpenNow,
    filterMinRating > 0,
    filterMaxPrice > 0,
    filterFoodType !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterOpenNow(false);
    setFilterMinRating(0);
    setFilterMaxPrice(0);
    setFilterFoodType('all');
  };

  const categories = [
    { id: 'all', label: 'All Food', icon: Utensils },
    { id: 'chaat', label: 'Chaat', icon: Sparkles },
    { id: 'south-indian', label: 'South Indian', icon: Pizza },
    { id: 'beverages', label: 'Beverages', icon: Coffee },
    { id: 'more', label: 'Explore More', icon: ChevronRight },
  ];

  const filteredVendors = vendors.filter(v => {
    let matchesCategory = selectedCategory === 'all';
    if (!matchesCategory) {
      const catLower = (v.category || '').toLowerCase();
      if (selectedCategory === 'south-indian') {
        matchesCategory = catLower.includes('dosa') || catLower.includes('south');
      } else if (selectedCategory === 'chaat') {
        matchesCategory = catLower.includes('chaat') || catLower.includes('bhel') || catLower.includes('puri');
      } else if (selectedCategory === 'beverages') {
        matchesCategory = catLower.includes('beverage') || catLower.includes('juice') || catLower.includes('chai') || catLower.includes('drink');
      } else {
        matchesCategory = catLower.includes(selectedCategory.toLowerCase());
      }
    }

    const matchesLocation = matchVendorLocation(v, selectedLocation);
    const matchesSearch = !searchQuery ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.category || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Active filters
    if (filterOpenNow && v.isOpen === false) return false;
    if (filterMinRating > 0 && (v.rating || 0) < filterMinRating) return false;
    if (filterMaxPrice > 0 && (v.priceForTwo || 999) > filterMaxPrice) return false;
    if (filterFoodType === 'veg' && !v.isVeg) return false;
    if (filterFoodType === 'nonveg' && v.isVeg === true) return false;

    return matchesLocation && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 pb-24 animate-fade-in">
      
      {/* Top Bar for Mobile */}
      <TopHeader
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      {/* Main Responsive Container (Full Width Desktop / Mobile Padding) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">

        {/* Mobile Search Bar (hidden on desktop navbar) */}
        <div className="md:hidden flex items-center bg-dark-card border border-slate-700/60 rounded-2xl px-3 py-2 gap-2 focus-within:border-emerald-500 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search for food or vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-slate-200 text-xs font-medium placeholder:text-slate-500"
          />
          <button
            onClick={() => setShowFilterPanel(true)}
            className="relative shrink-0 p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-400 transition-all active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Hero Banner (Compact horizontal layout on mobile for 1-screen fit) */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-r from-dark-surface via-slate-900 to-slate-950 p-3.5 sm:p-5 md:p-8 border border-slate-800/80 shadow-xl flex flex-row items-center justify-between gap-3 md:gap-6">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1.5 md:space-y-4 max-w-xl z-10 text-left flex-1">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold text-emerald-400">
              <Sparkles className="w-3 h-3 text-orange shrink-0" />
              <span className="truncate">Authentic Street Food</span>
            </div>

            <h2 className="text-base sm:text-xl md:text-3xl font-black leading-tight text-white">
              Good Food. Good Mood.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-orange font-black">
                Local is Love.
              </span>
            </h2>

            <p className="hidden sm:block text-xs md:text-sm text-slate-400 leading-relaxed max-w-md">
              Discover verified local street stalls, order fresh vada pav, dosas, and chaat, or navigate directly to your favorite vendor!
            </p>

            <div className="pt-0.5 md:pt-1">
              <button
                onClick={() => onNavigateToSearch && onNavigateToSearch()}
                className="px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] md:text-xs font-bold shadow-emerald-glow transition-all flex items-center space-x-1.5"
              >
                <span>Explore Stalls</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hero Banner Image (Compact side thumbnail on mobile) */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-xl md:rounded-3xl overflow-hidden border border-slate-700/60 shadow-lg shrink-0">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80"
              alt="Delicious Street Food"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Categories Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-wide">Categories</h3>
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto scroll-hide py-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === 'more') {
                      onNavigateToSearch && onNavigateToSearch();
                    } else {
                      setSelectedCategory(cat.id);
                    }
                  }}
                  className={`flex flex-col md:flex-row items-center justify-center min-w-[76px] md:min-w-0 md:px-5 md:py-3 p-3 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-emerald-glow scale-105'
                      : 'bg-[#1E293B] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-2 rounded-xl mb-1 md:mb-0 md:mr-2 ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] md:text-xs font-bold tracking-tight whitespace-nowrap">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nearby Vendors (Responsive Grid: 1-2 on mobile, 3-4 on desktop) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-wide">Nearby Food Stalls</h3>
            <button
              onClick={() => onNavigateToSearch && onNavigateToSearch()}
              className="text-xs font-semibold text-emerald-400 hover:underline"
            >
              See all ({filteredVendors.length})
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="h-48 rounded-2xl skeleton" />
              <div className="h-48 rounded-2xl skeleton" />
              <div className="h-48 rounded-2xl skeleton hidden md:block" />
              <div className="h-48 rounded-2xl skeleton hidden md:block" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredVendors.map((vendor) => {
                const vId = vendor.id || vendor._id;
                const fav = isFavorite(vId);

                return (
                  <div
                    key={vId}
                    onClick={() => onSelectVendor({ ...vendor, id: vId })}
                    className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-lg hover:border-emerald-500/50 hover:shadow-emerald-900/20 cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    {/* Top Thumbnail Banner */}
                    <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                      <img
                        loading="lazy"
                        src={vendor.banner || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80'}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Heart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(vId);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-[#0F172A]/80 backdrop-blur-md text-slate-300 hover:text-red-500 transition-all border border-slate-700/60 shadow-sm"
                      >
                        <Heart className={`w-4 h-4 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>

                      {/* Rating Badge */}
                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-dark-surface/90 backdrop-blur-md text-xs font-bold text-slate-200 flex items-center space-x-1 border border-slate-700/60 shadow-sm">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{vendor.rating || 4.5}</span>
                      </div>
                    </div>

                    {/* Vendor Content */}
                    <div className="p-4 space-y-2">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {vendor.name}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{vendor.category}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{vendor.distance || '0.3 km'}</span>
                        </span>
                        <span className="text-emerald-400 font-semibold">Open Now</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ── Filter Bottom Sheet Panel ── */}
      {showFilterPanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={() => setShowFilterPanel(false)}
          />

          {/* Panel */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-slate-700/80 rounded-t-3xl z-[201] pb-8 animate-slide-up">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-600" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <h3 className="text-sm font-black text-white">Filter Stalls</h3>
              <div className="flex items-center space-x-3">
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs font-semibold text-orange hover:text-orange/80">
                    Clear all
                  </button>
                )}
                <button onClick={() => setShowFilterPanel(false)} className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="px-5 pt-4 space-y-5">

              {/* Open Now Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Open Now</p>
                  <p className="text-xs text-slate-400">Only show stalls currently open</p>
                </div>
                <button
                  onClick={() => setFilterOpenNow(p => !p)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${filterOpenNow ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${filterOpenNow ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Min Rating */}
              <div>
                <p className="text-sm font-bold text-white mb-2.5">Minimum Rating</p>
                <div className="flex items-center space-x-2">
                  {[0, 3.5, 4.0, 4.5].map(r => (
                    <button
                      key={r}
                      onClick={() => setFilterMinRating(r)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        filterMinRating === r
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#1E293B] text-slate-300 border border-slate-700'
                      }`}
                    >
                      {r === 0 ? <span>Any</span> : <><Star className="w-3 h-3 fill-current" /><span>{r}+</span></>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div>
                <p className="text-sm font-bold text-white mb-2.5">Price for Two</p>
                <div className="flex items-center space-x-2">
                  {[{ label: 'Any', val: 0 }, { label: '₹50', val: 50 }, { label: '₹100', val: 100 }, { label: '₹200', val: 200 }].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setFilterMaxPrice(opt.val)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        filterMaxPrice === opt.val
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#1E293B] text-slate-300 border border-slate-700'
                      }`}
                    >
                      {opt.label}{opt.val > 0 ? ' max' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Type */}
              <div>
                <p className="text-sm font-bold text-white mb-2.5">Food Type</p>
                <div className="flex items-center space-x-2">
                  {[
                    { id: 'all', label: '🍽️ All' },
                    { id: 'veg', label: '🥦 Veg Only' },
                    { id: 'nonveg', label: '🍗 Non-Veg' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setFilterFoodType(opt.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        filterFoodType === opt.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#1E293B] text-slate-300 border border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setShowFilterPanel(false)}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Show {filteredVendors.length} Stalls</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
