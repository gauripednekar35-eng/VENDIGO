import React, { useEffect, useRef } from 'react';
import { MapPin, Star, Clock, ArrowRight, X } from 'lucide-react';
import L from 'leaflet';

export const OpenStreetMapDiscovery = ({ vendors, locationCoords, onSelectVendor, onClose }) => {
  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Destroy existing instance if any
    if (leafletMapInstance.current) {
      leafletMapInstance.current.remove();
    }

    // Use passed coordinates or default Dahisar/Mumbai center
    const centerLat = locationCoords?.[0] || 19.2500;
    const centerLng = locationCoords?.[1] || 72.8590;

    const map = L.map(mapRef.current).setView([centerLat, centerLng], 13);
    leafletMapInstance.current = map;

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom Icon Creator
    const createCustomIcon = (isOpen) => {
      return L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="
            background-color: ${isOpen ? '#2E7D32' : '#64748B'};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 3px solid white;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8c0 3.6-6 10-6 10s-6-6.4-6-10a6 6 0 0 1 12 0Z"/><circle cx="12" cy="8" r="2"/></svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -32]
      });
    };

    // Plot vendors on map
    vendors.forEach(vendor => {
      if (vendor.coordinates && vendor.coordinates.length === 2) {
        const marker = L.marker(vendor.coordinates, {
          icon: createCustomIcon(vendor.isOpen)
        }).addTo(map);

        const popupContent = document.createElement('div');
        popupContent.className = 'p-1 text-slate-900';
        popupContent.innerHTML = `
          <div style="min-width: 200px;">
            <div style="font-weight: 800; font-size: 14px; margin-bottom: 2px;">${vendor.name}</div>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">${vendor.address.split(',')[0]}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="background: #E8F5E9; color: #1B5E20; padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 11px;">★ ${vendor.rating}</span>
              <span style="font-size: 11px; font-weight: 700; color: #1E293B;">${vendor.priceForTwo}</span>
            </div>
            <button id="btn-vendor-${vendor.id}" style="
              width: 100%;
              background: #2E7D32;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 8px;
              font-weight: 700;
              font-size: 11px;
              cursor: pointer;
            ">View Stall Menu</button>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-vendor-${vendor.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectVendor(vendor);
            };
          }
        });
      }
    });

    return () => {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
      }
    };
  }, [vendors, locationCoords, onSelectVendor]);

  return (
    <div className="relative bg-white rounded-3xl p-4 border border-slate-200 shadow-xl mb-10 overflow-hidden">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Mumbai OpenStreetMap Vendor Discovery
          </h3>
          <p className="text-xs text-slate-500">Live locations of street food vendors plotted using OpenStreetMap.</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="h-96 w-full rounded-2xl overflow-hidden border border-slate-200 relative">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
};
