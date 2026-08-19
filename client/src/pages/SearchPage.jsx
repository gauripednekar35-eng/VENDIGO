import { useVendors } from '../context/VendorContext';
import { useFavorites } from '../context/FavoritesContext';
import { matchVendorLocation } from '../utils/locationHelper';
import { Search, SlidersHorizontal, Star, Heart, X, ChevronDown, Check } from 'lucide-react';

const CATEGORY_FILTERS = [
  { id: 'all',       label: '🍽️ All' },
  { id: 'open',      label: '🟢 Open Now' },
  { id: 'topRated',  label: '⭐ Top Rated' },
  { id: 'under50',   label: '💸 Under ₹50' },
  { id: 'veg',       label: '🥦 Veg Only' },
  { id: 'fastFood',  label: '🍔 Fast Food' },
  { id: 'chai',      label: '☕ Chai & Snacks' },
  { id: 'biryani',   label: '🍛 Biryani' },
  { id: 'momos',     label: '🥟 Momos' },
  { id: 'juice',     label: '🧃 Juice & Drinks' },
  { id: 'dosa',      label: '🫓 Dosa & South Indian' },
  { id: 'chaat',     label: '🍡 Chaat' },
];

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'rating',    label: 'Top Rated' },
  { id: 'distance',  label: 'Nearest First' },
  { id: 'newest',    label: 'Newly Added' },
];

export const SearchPage = ({ selectedLocation, onSelectVendor }) => {
  const { vendors } = useVendors();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [query, setQuery]               = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy]             = useState('relevance');
  const [showPanel, setShowPanel]       = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Panel filters
  const [minRating, setMinRating]     = useState(0);
  const [maxDistance, setMaxDistance] = useState(5);
  const [vegOnly, setVegOnly]         = useState(false);
  const [maxPrice, setMaxPrice]       = useState(500);

  const activeFilterCount = [
    minRating > 0,
    maxDistance < 5,
    vegOnly,
    maxPrice < 500,
  ].filter(Boolean).length;

  const matchesCategory = (v) => {
    if (activeFilter === 'open')     return v.isOpen !== false;
    if (activeFilter === 'topRated') return (v.rating || 0) >= 4.5;
    if (activeFilter === 'under50')  return (v.minPrice || 30) <= 50;
    if (activeFilter === 'veg')      return v.isVeg === true || v.category?.toLowerCase().includes('veg');
    if (activeFilter === 'fastFood') return v.category?.toLowerCase().includes('fast') || v.category?.toLowerCase().includes('burger');
    if (activeFilter === 'chai')     return v.category?.toLowerCase().includes('chai') || v.category?.toLowerCase().includes('snack');
    if (activeFilter === 'biryani')  return v.category?.toLowerCase().includes('biryani') || v.category?.toLowerCase().includes('rice');
    if (activeFilter === 'momos')    return v.category?.toLowerCase().includes('momo') || v.category?.toLowerCase().includes('chinese');
    if (activeFilter === 'juice')    return v.category?.toLowerCase().includes('juice') || v.category?.toLowerCase().includes('beverage') || v.category?.toLowerCase().includes('drink');
    if (activeFilter === 'dosa')     return v.category?.toLowerCase().includes('dosa') || v.category?.toLowerCase().includes('south');
    if (activeFilter === 'chaat')    return v.category?.toLowerCase().includes('chaat') || v.category?.toLowerCase().includes('puri');
    return true;
  };

  let filtered = vendors.filter(v => {
    if (!matchVendorLocation(v, selectedLocation)) return false;

    const matchesQuery = !query ||
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.category.toLowerCase().includes(query.toLowerCase());
    if (!matchesQuery) return false;
    if (!matchesCategory(v)) return false;
    if (vegOnly && !(v.isVeg === true || v.category?.toLowerCase().includes('veg'))) return false;
    if ((v.rating || 0) < minRating) return false;
    const dist = parseFloat(v.distance || '0.3');
    if (dist > maxDistance) return false;
    return true;
  });

  if (sortBy === 'rating')   filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sortBy === 'distance') filtered = [...filtered].sort((a, b) => parseFloat(a.distance || '0.3') - parseFloat(b.distance || '0.3'));

  const clearPanelFilters = () => {
    setMinRating(0); setMaxDistance(5); setVegOnly(false); setMaxPrice(500);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 pb-24 pt-6 px-4 max-w-7xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <h1 className="text-2xl font-black text-white">Explore Street Food Vendors</h1>

      {/* Search + Sort Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search vendors by name, vada pav, momos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#1E293B] border border-slate-700 text-slate-100 text-xs font-medium focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(p => !p)}
            className="flex items-center space-x-1.5 px-3.5 py-3 rounded-2xl bg-[#1E293B] border border-slate-700 text-xs font-bold text-slate-200 hover:border-slate-500 transition-all whitespace-nowrap"
          >
            <span>{SORT_OPTIONS.find(s => s.id === sortBy)?.label}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-12 z-50 bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden min-w-[160px]">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setSortBy(opt.id); setShowSortMenu(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-all hover:bg-slate-700 ${sortBy === opt.id ? 'text-emerald-400' : 'text-slate-200'}`}
                >
                  {opt.label}
                  {sortBy === opt.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Panel Toggle */}
        <button
          onClick={() => setShowPanel(true)}
          className={`relative flex items-center space-x-1.5 px-3.5 py-3 rounded-2xl border text-xs font-bold transition-all whitespace-nowrap ${
            activeFilterCount > 0
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'bg-[#1E293B] border-slate-700 text-slate-200 hover:border-slate-500'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-white text-emerald-700 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Category Chips Strip */}
      <div className="flex items-center space-x-2 overflow-x-auto scroll-hide pb-1">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
              activeFilter === f.id
                ? 'bg-emerald-600 text-white shadow-lg scale-105'
                : 'bg-[#1E293B] text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-xs text-slate-400 font-semibold">
        {filtered.length} vendor{filtered.length !== 1 ? 's' : ''} found
        {query && <span className="text-emerald-400"> for "{query}"</span>}
      </p>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-bold text-slate-300">No vendors found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : filtered.map((vendor) => {
          const fav = isFavorite(vendor.id);
          return (
            <div
              key={vendor.id}
              onClick={() => onSelectVendor(vendor)}
              className="bg-[#1E293B] rounded-2xl p-4 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all flex items-center justify-between group shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  <img
                    loading="lazy"
                    src={vendor.banner || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80'}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {vendor.name}
                  </h4>
                  <div className="flex items-center space-x-1 text-xs">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-amber-300">{vendor.rating || 4.5}</span>
                    <span className="text-slate-500">({vendor.reviewCount || 120})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{vendor.category}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                    <span>{vendor.distance || '0.3 km'}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">Open Now</span>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(vendor.id); }}
                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
              >
                <Heart className={`w-5 h-5 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Slide-out Filter Panel ── */}
      {showPanel && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPanel(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-xs bg-[#0F172A] border-l border-slate-700 h-full flex flex-col shadow-2xl animate-slide-up">

            {/* Panel Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
              <h3 className="text-base font-black text-white">Filters</h3>
              <div className="flex items-center space-x-3">
                {activeFilterCount > 0 && (
                  <button onClick={clearPanelFilters} className="text-xs text-emerald-400 font-bold hover:text-emerald-300">
                    Clear All
                  </button>
                )}
                <button onClick={() => setShowPanel(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">

              {/* Minimum Rating */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Minimum Rating</h4>
                <div className="flex items-center space-x-2">
                  {[0, 3, 3.5, 4, 4.5].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        minRating === r
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#1E293B] text-slate-400 border border-slate-700 hover:text-white'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Distance */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Max Distance</h4>
                  <span className="text-xs font-bold text-emerald-400">{maxDistance} km</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={maxDistance}
                  onChange={e => setMaxDistance(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>0.5 km</span><span>5 km</span>
                </div>
              </div>

              {/* Max Price */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Max Price</h4>
                  <span className="text-xs font-bold text-emerald-400">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={maxPrice}
                  onChange={e => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>₹20</span><span>₹500</span>
                </div>
              </div>

              {/* Veg Only Toggle */}
              <div className="flex items-center justify-between py-3 border-t border-slate-800">
                <div>
                  <p className="text-xs font-black text-slate-200 uppercase tracking-widest">Veg Only 🥦</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Show only vegetarian stalls</p>
                </div>
                <button
                  onClick={() => setVegOnly(p => !p)}
                  className={`w-11 h-6 rounded-full transition-all duration-300 relative ${vegOnly ? 'bg-emerald-600' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${vegOnly ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {/* Quick Cuisine Filters */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Cuisine Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['🍔 Fast Food','🍛 Biryani','🥟 Momos','🫓 Dosa','🍡 Chaat','☕ Chai'].map(c => {
                    const id = c.split(' ').slice(1).join(' ').toLowerCase();
                    const isActive = activeFilter === id.replace(/ /g, '').replace('&','');
                    return (
                      <button
                        key={c}
                        onClick={() => { setActiveFilter(isActive ? 'all' : id.replace(/ /g, '').replace('chai','chai')); setShowPanel(false); }}
                        className={`py-2 px-3 rounded-xl text-[11px] font-bold text-left transition-all ${
                          isActive ? 'bg-emerald-600 text-white' : 'bg-[#1E293B] text-slate-300 border border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="px-5 py-4 border-t border-slate-700">
              <button
                onClick={() => setShowPanel(false)}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black transition-all shadow-lg"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
