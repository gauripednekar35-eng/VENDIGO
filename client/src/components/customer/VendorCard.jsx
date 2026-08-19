import React from 'react';
import { Star, Clock, MapPin, CheckCircle } from 'lucide-react';

export const VendorCard = ({ vendor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Banner Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={vendor.banner}
            alt={vendor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Open / Closed Status Badge */}
          <div className="absolute top-3 left-3">
            {vendor.isOpen ? (
              <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-extrabold flex items-center space-x-1 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                <span>OPEN NOW</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-slate-800/90 backdrop-blur-md text-white text-[11px] font-extrabold shadow-md">
                CLOSED
              </span>
            )}
          </div>

          {/* Approval Badge */}
          {vendor.isApproved && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-primary p-1.5 rounded-full shadow-md">
              <CheckCircle className="w-4 h-4 fill-primary text-white" />
            </div>
          )}

          {/* Bottom Banner Stats */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
            <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              {vendor.prepTime}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {vendor.distance}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors leading-snug line-clamp-1">
              {vendor.name}
            </h3>

            {/* Rating Badge */}
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-emerald-700 text-white text-xs font-bold shrink-0">
              <span>{vendor.rating}</span>
              <Star className="w-3 h-3 fill-white text-white" />
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {vendor.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {vendor.tags?.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
        <span>{vendor.address.split(',')[0]}</span>
        <span className="text-slate-900 font-bold">{vendor.priceForTwo}</span>
      </div>
    </div>
  );
};
