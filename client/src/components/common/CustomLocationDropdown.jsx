import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';

const LOCATIONS = [
  { id: 'all',          name: 'All Locations',                city: '' },
  { id: 'indiranagar', name: 'Indiranagar, Bangalore',        city: 'Bangalore' },
  { id: 'koramangala', name: 'Koramangala, Bangalore',        city: 'Bangalore' },
  { id: 'vvpuram',     name: 'Jayanagar & VV Puram, Bangalore', city: 'Bangalore' },
  { id: 'hsr',          name: 'HSR Layout, Bangalore',        city: 'Bangalore' },
  { id: 'mgroad',       name: 'MG Road & Commercial St, Bangalore', city: 'Bangalore' },
  { id: 'dahisar-w',   name: 'Dahisar West, Mumbai',          city: 'Mumbai' },
  { id: 'borivali-w',  name: 'Borivali West, Mumbai',         city: 'Mumbai' },
  { id: 'bandra-w',    name: 'Bandra West, Mumbai',           city: 'Mumbai' },
  { id: 'andheri-w',   name: 'Andheri West, Mumbai',          city: 'Mumbai' }
];

export const CustomLocationDropdown = ({ selectedLocation, setSelectedLocation, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedObj = LOCATIONS.find(l => l.id === selectedLocation) || LOCATIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center space-x-2 transition-all cursor-pointer ${
          isMobile
            ? 'bg-transparent text-xs font-bold text-slate-100 hover:text-emerald-400 py-1'
            : 'bg-[#1E293B] hover:bg-[#334155] px-3.5 py-2 rounded-xl border border-slate-600 text-xs text-white shadow-md'
        }`}
      >
        <MapPin className={`w-4 h-4 shrink-0 ${isMobile ? 'text-emerald-400 fill-emerald-400/20' : 'text-emerald-400'}`} />
        <span className="font-bold whitespace-nowrap">{selectedObj.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
      </button>

      {/* Floating Popover Options Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-[#0F172A] border border-slate-700 shadow-2xl z-[100] py-2 animate-fade-in">
          <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Select Location
          </div>
          
          <div className="max-h-60 overflow-y-auto py-1">
            {LOCATIONS.map((loc) => {
              const isSelected = selectedLocation === loc.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    setSelectedLocation(loc.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-600/20 text-emerald-400 border-l-4 border-emerald-500 font-bold'
                      : 'text-slate-200 hover:bg-[#1E293B] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{loc.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
