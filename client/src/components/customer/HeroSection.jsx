import React from 'react';
import { Search, Sparkles, Flame, ShieldCheck } from 'lucide-react';

export const HeroSection = ({ searchQuery, setSearchQuery, onExploreMap }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-primary-dark to-slate-900 text-white p-6 sm:p-10 lg:p-12 mb-10 shadow-xl">
      
      {/* Background Decorative Circles & Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Heading & Search */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Hyperlocal Street Food Discovery Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Authentic <span className="text-secondary underline decoration-secondary/40 underline-offset-8">Local Street Food</span> Around You.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Explore legendary street stalls, legendary Aloo Tikkis, spicy Kathi Rolls, hot Dumplings & fresh Dosa. Order direct with instant Cash on Delivery.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search vendor name, golgappa, momos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-secondary/30 shadow-lg"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Features Highlights */}
          <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-secondary" />
              <span>100+ Local Vendors</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-primary-light" />
              <span>Sanitation Inspected Stalls</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Fast 15-Min Prep</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Card */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
              alt="Crispy Street Chaat"
              className="w-full h-80 object-cover rounded-3xl shadow-2xl border-4 border-white/10 transform rotate-1 hover:rotate-0 transition-transform duration-500"
            />

          </div>
        </div>

      </div>
    </div>
  );
};
