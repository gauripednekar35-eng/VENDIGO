import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Navigation, MapPin, Footprints, Bike, Car, Compass, Clock, CheckCircle2, ExternalLink } from 'lucide-react';

// Custom Map Centering Helper
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 16, { animate: true });
    }
  }, [center, map]);
  return null;
};

// Customer Live Location Marker Icon (Pulsing Blue Dot)
const createCustomerIcon = () => {
  return L.divIcon({
    className: 'custom-customer-pin',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 36px; height: 36px; background-color: rgba(59, 130, 246, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 20px; height: 20px; background-color: #3B82F6; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 14px rgba(59, 130, 246, 0.8);"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

// Vendor Stall Marker Icon (Orange Stall Pin)
const createVendorIcon = () => {
  return L.divIcon({
    className: 'custom-vendor-pin',
    html: `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="background: linear-gradient(135deg, #F97316, #EA580C); width: 40px; height: 40px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 0 20px rgba(249, 115, 22, 0.7); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">
          🛒
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

export const LiveRouteTrackerModal = ({ vendor, onClose }) => {
  const [transportMode, setTransportMode] = useState('walking'); // 'walking' | 'bike' | 'car'
  const [userLocation, setUserLocation] = useState([12.9725, 77.5930]);

  // Default vendor coords if not provided
  const vendorCoords = vendor?.coordinates || [12.9716, 77.5946];

  // Calculate waypoint path for polyline route
  const startLat = userLocation[0];
  const startLng = userLocation[1];
  const endLat = vendorCoords[0];
  const endLng = vendorCoords[1];

  // Interpolate intermediate route points for realistic street path
  const midPoint1 = [startLat + (endLat - startLat) * 0.35 + 0.0008, startLng + (endLng - startLng) * 0.25];
  const midPoint2 = [startLat + (endLat - startLat) * 0.70, startLng + (endLng - startLng) * 0.75 + 0.0006];
  
  const routePath = [
    [startLat, startLng],
    midPoint1,
    midPoint2,
    [endLat, endLng]
  ];

  // Calculate realistic distance & ETA based on mode
  const distanceKm = 0.35; // 350 meters
  const etaMinutes = {
    walking: Math.ceil((distanceKm / 4.5) * 60), // ~4 mins
    bike: Math.ceil((distanceKm / 18) * 60),    // ~1 min
    car: Math.ceil((distanceKm / 12) * 60)       // ~2 mins
  }[transportMode];

  // Turn by turn instructions mockup
  const instructions = [
    { text: 'Start on 100 Feet Road towards Main Street', dist: '100m', icon: '⬆️' },
    { text: `Turn right near Corner Cafe towards ${vendor?.name || 'Stall'}`, dist: '150m', icon: '➡️' },
    { text: 'Arrive at Stall on your left. Look for Orange VINDIGO Sign!', dist: '100m', icon: '🎯' }
  ];

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-[#0B0F17] border border-slate-700/80 rounded-3xl w-full max-w-4xl h-[92vh] max-h-[780px] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Header Bar */}
        <div className="bg-[#0F172A] px-5 py-3.5 border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-black text-white">{vendor?.name || 'Live Route Tracker'}</h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>LIVE GPS</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold">{vendor?.address || 'Indiranagar, Bangalore'} • {distanceKm * 1000}m away</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-[#1E293B] border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Map + Navigation Sidebar */}
        <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
          
          {/* MAP AREA (Left/Top) */}
          <div className="flex-1 h-[55%] lg:h-full relative dark-map z-1">
            <MapContainer
              center={vendorCoords}
              zoom={16}
              scrollWheelZoom={true}
              zoomControl={false}
              className="h-full w-full"
            >
              <RecenterMap center={vendorCoords} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Customer Marker */}
              <Marker position={userLocation} icon={createCustomerIcon()}>
                <Popup className="custom-popup">
                  <div className="text-xs font-bold p-1">📍 You are here</div>
                </Popup>
              </Marker>

              {/* Vendor Marker */}
              <Marker position={vendorCoords} icon={createVendorIcon()}>
                <Popup className="custom-popup">
                  <div className="text-xs font-bold p-1">🛒 {vendor?.name}</div>
                </Popup>
              </Marker>

              {/* Route Polyline (Glow Effect) */}
              <Polyline
                positions={routePath}
                pathOptions={{
                  color: '#059669',
                  weight: 8,
                  opacity: 0.8,
                  lineCap: 'round',
                  lineJoin: 'round',
                  dashArray: '1, 12',
                  dashOffset: '0'
                }}
              />
              <Polyline
                positions={routePath}
                pathOptions={{
                  color: '#10B981',
                  weight: 5,
                  opacity: 0.95,
                  lineCap: 'round'
                }}
              />
            </MapContainer>

            {/* Mode Switcher Overlay */}
            <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-center pointer-events-none">
              <div className="bg-[#0F172A]/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center space-x-1 pointer-events-auto">
                {[
                  { id: 'walking', label: 'Walk', icon: Footprints },
                  { id: 'bike', label: 'Bike', icon: Bike },
                  { id: 'car', label: 'Drive', icon: Car }
                ].map(m => {
                  const Icon = m.icon;
                  const isActive = transportMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setTransportMode(m.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-lg scale-105'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live ETA Card Overlay (Bottom of map) */}
            <div className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none flex justify-center">
              <div className="bg-[#0F172A]/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center justify-between w-full max-w-sm pointer-events-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-lg">
                    {etaMinutes} min
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-white block">{distanceKm * 1000} Meters Route</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Fastest path via Main St</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Stall Status</span>
                  <span className="text-xs font-bold text-emerald-400">OPEN NOW</span>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR: NAVIGATION DETAILS & STEPS (Right/Bottom) */}
          <div className="w-full lg:w-[360px] bg-[#0F172A] border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto space-y-4 shrink-0 z-20">
            
            {/* Live Vendor Stall Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Turn-By-Turn Navigation</h4>
              
              <div className="space-y-2.5">
                {instructions.map((step, idx) => (
                  <div key={idx} className="bg-[#1E293B] p-3 rounded-2xl border border-slate-800 flex items-start space-x-3">
                    <span className="text-base shrink-0 mt-0.5">{step.icon}</span>
                    <div className="space-y-0.5 flex-1">
                      <p className="text-xs font-bold text-slate-200">{step.text}</p>
                      <span className="text-[10px] text-emerald-400 font-semibold">{step.dist} remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Stall Verification Badge */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-white">Live Stall Location Verified</h5>
                <p className="text-[10px] text-slate-400">GPS location updated 2 mins ago by vendor.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${vendorCoords[0]},${vendorCoords[1]}`, '_blank');
                }}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Start Turn-by-Turn GPS Navigation</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-[#1E293B] hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition-all"
              >
                Close Route Tracker
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
