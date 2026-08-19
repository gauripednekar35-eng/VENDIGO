import React, { useState, lazy, Suspense } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useVendors } from '../context/VendorContext';
import { useFavorites } from '../context/FavoritesContext';
import { TopHeader } from '../components/common/TopHeader';
import { matchVendorLocation } from '../utils/locationHelper';
import { Star, Navigation, Heart, Search, Compass } from 'lucide-react';

// Lazy-load heavy Leaflet route tracker modal
const LiveRouteTrackerModal = lazy(() =>
  import('../components/customer/LiveRouteTrackerModal').then(m => ({ default: m.LiveRouteTrackerModal }))
);

// Create pin icons lazily inside a getter to avoid calling L.divIcon() at module load time
// (Module-level Leaflet calls crash the app before React mounts)
const getPinIcon = (color = '#059669') => L.divIcon({
  className: 'custom-pin',
  html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 0 12px ${color}; display: flex; align-items: center; justify-content: center;">
    <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});


export const MapPage = ({ selectedLocation, setSelectedLocation, onSelectVendor }) => {
  const { vendors } = useVendors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeVendor, setActiveVendor] = useState(vendors[0] || null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingVendor, setTrackingVendor] = useState(null);

  // Desktop sidebar filters
  const desktopFilters = [
    { id: 'all', label: 'All Stalls' },
    { id: 'open', label: 'Open Now' },
    { id: 'under50', label: 'Under ₹50' },
    { id: 'topRated', label: 'Top Rated' }
  ];

  // Mobile filter chips — more categories
  const mobileFilters = [
    { id: 'all', label: '🍽️ All', emoji: true },
    { id: 'open', label: '🟢 Open Now', emoji: true },
    { id: 'topRated', label: '⭐ Top Rated', emoji: true },
    { id: 'under50', label: '💸 Under ₹50', emoji: true },
    { id: 'veg', label: '🥦 Veg Only', emoji: true },
    { id: 'fastFood', label: '🍔 Fast Food', emoji: true },
    { id: 'chai', label: '☕ Chai & Snacks', emoji: true },
    { id: 'biryani', label: '🍛 Biryani', emoji: true },
  ];

  const filteredVendors = vendors.filter(v => {
    const matchesLoc = matchVendorLocation(v, selectedLocation);
    if (!matchesLoc) return false;

    const matchesSearch = !searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'open') return v.isOpen !== false;
    if (activeFilter === 'topRated') return (v.rating || 0) >= 4.5;
    if (activeFilter === 'veg') return v.isVeg === true || v.category?.toLowerCase().includes('veg');
    if (activeFilter === 'fastFood') return v.category?.toLowerCase().includes('fast') || v.category?.toLowerCase().includes('burger');
    if (activeFilter === 'chai') return v.category?.toLowerCase().includes('chai') || v.category?.toLowerCase().includes('snack');
    if (activeFilter === 'biryani') return v.category?.toLowerCase().includes('biryani') || v.category?.toLowerCase().includes('rice');
    return true;
  });

  const getCityCenter = (loc) => {
    if (loc === 'indiranagar') return [12.9716, 77.6412];
    if (loc === 'koramangala') return [12.9352, 77.6245];
    if (loc === 'dahisar-w') return [19.2505, 72.8585];
    if (loc === 'bandra-w') return [19.0596, 72.8295];
    return [12.9716, 77.5946];
  };

  const mapCenter = activeVendor?.coordinates || (filteredVendors[0]?.coordinates) || getCityCenter(selectedLocation);

  return (
    <div className="h-full bg-[#0B0F17] text-white flex flex-col md:flex-row animate-fade-in relative overflow-hidden">
      
      {/* Mobile Top Header */}
      <TopHeader
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      {/* Mobile Filter Chips Bar */}
      <div className="md:hidden bg-[#0B0F17] border-b border-slate-800/60 px-3 py-2.5 z-20">
        <div className="flex items-center space-x-2 overflow-x-auto scroll-hide">
          {mobileFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                activeFilter === f.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 scale-105'
                  : 'bg-[#1E293B] text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP / LAPTOP SPLIT VIEW LEFT COLUMN */}
      <div className="hidden md:flex w-full md:w-[420px] lg:w-[460px] shrink-0 bg-[#0F172A] border-r border-slate-700 flex-col h-[calc(100vh-64px)] overflow-hidden z-20">
        
        {/* Filters & Search Header */}
        <div className="p-4 space-y-3 border-b border-slate-700 bg-[#0F172A]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search map vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E293B] text-white font-semibold text-xs pl-9 pr-4 py-3 rounded-xl border border-slate-600 focus:outline-none focus:border-emerald-500 placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto scroll-hide">
            {desktopFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === f.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-[#1E293B] text-slate-200 border border-slate-600 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vendor List for Desktop Split Screen */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredVendors.map((vendor) => {
            const isSelected = activeVendor?.id === vendor.id;
            const fav = isFavorite(vendor.id);

            return (
              <div
                key={vendor.id}
                onClick={() => setActiveVendor(vendor)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-[#1E293B] border-emerald-500 shadow-lg'
                    : 'bg-[#1E293B] border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={vendor.banner || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80'}
                    alt={vendor.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-600"
                  />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {vendor.name}
                    </h4>
                    <div className="flex items-center space-x-1 text-[11px] text-slate-300 font-semibold">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-amber-300">{vendor.rating || 4.7}</span>
                      <span>• {vendor.distance || '0.3 km'}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold block">Open Now</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(vendor.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500"
                    title="Favorite"
                  >
                    <Heart className={`w-4 h-4 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTrackingVendor(vendor);
                    }}
                    className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-all flex items-center space-x-1"
                    title="Live Route Tracker"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Route</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVendor(vendor);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* RIGHT COLUMN: INTERACTIVE LEAFLET MAP */}
      <div className="flex-1 min-h-0 relative dark-map z-[1]" style={{ minHeight: 0 }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: '100%', width: '100%', minHeight: '400px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredVendors.map((vendor, idx) => {
            const coords = vendor.coordinates || [12.9716 + (idx * 0.005), 77.5946 + (idx * 0.005)];
            const isSelected = activeVendor?.id === vendor.id;

            return (
              <Marker
                key={vendor.id}
                position={coords}
                icon={isSelected ? getPinIcon('#F97316') : getPinIcon('#059669')}
                eventHandlers={{
                  click: () => setActiveVendor(vendor),
                }}
              />
            );
          })}
        </MapContainer>

        {/* Floating Vendor Bottom Popup Card (Mobile view) */}
        {activeVendor && (
          <div className="md:hidden absolute bottom-20 left-4 right-4 z-[1000] animate-slide-up">
            <div className="bg-[#0F172A] rounded-3xl p-4 border border-slate-700 shadow-2xl space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  src={activeVendor.banner || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80'}
                  alt={activeVendor.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-600"
                />

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{activeVendor.name}</h4>
                    <button
                      onClick={() => toggleFavorite(activeVendor.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(activeVendor.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-slate-200">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold">{activeVendor.rating || 4.7}</span>
                    <span className="text-slate-400">• {activeVendor.distance || '0.3 km'}</span>
                  </div>

                  <div className="text-[10px] font-bold text-emerald-400">
                    Open Now • Closes 10:00 PM
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => setTrackingVendor(activeVendor)}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Live Route Tracker</span>
                </button>

                <button
                  onClick={() => onSelectVendor(activeVendor)}
                  className="px-4 py-3 rounded-2xl bg-[#1E293B] border border-slate-600 text-slate-200 hover:text-white text-xs font-bold"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Route Tracker Modal - lazy loaded */}
      {trackingVendor && (
        <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading map…</div>}>
          <LiveRouteTrackerModal
            vendor={trackingVendor}
            onClose={() => setTrackingVendor(null)}
          />
        </Suspense>
      )}

    </div>
  );
};
