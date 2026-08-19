import React from 'react';
import { UtensilsCrossed, Heart, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                VEND<span className="text-primary-light">IGO</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering local street food vendors and connecting food lovers with hygienic, authentic, and affordable street food discoveries.
            </p>
            <div className="flex items-center space-x-3 text-slate-400 text-xs pt-1">
              <span className="inline-flex items-center gap-1 text-secondary font-medium">
                <ShieldCheck className="w-4 h-4 text-secondary" /> Verified Vendors
              </span>
              <span>•</span>
              <span>100% Cash on Delivery</span>
            </div>
          </div>

          {/* Col 2: Discovery Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Street Food Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-primary-light transition-colors cursor-pointer">Aloo Tikki & Papdi Chaat</li>
              <li className="hover:text-primary-light transition-colors cursor-pointer">Kathi Rolls & Frankies</li>
              <li className="hover:text-primary-light transition-colors cursor-pointer">Steamed & Fried Momos</li>
              <li className="hover:text-primary-light transition-colors cursor-pointer">South Indian Dosa & Idli</li>
              <li className="hover:text-primary-light transition-colors cursor-pointer">Indo-Chinese Chowmein</li>
              <li className="hover:text-primary-light transition-colors cursor-pointer">Desi Ghee Jalebi & Rabri</li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform Roles</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">Customer Discovery Portal</li>
              <li className="hover:text-white transition-colors cursor-pointer">Street Vendor Partner Portal</li>
              <li className="hover:text-white transition-colors cursor-pointer">Admin Governance Portal</li>
              <li className="hover:text-white transition-colors cursor-pointer">Cash on Delivery Policy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Vendor Sanitation Standards</li>
            </ul>
          </div>

          {/* Col 4: Contact & Project Note */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Project Info</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed as a modern Hyperlocal Web Engineering Project.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-light shrink-0" /> Delhi NCR Street Food Hub</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-light shrink-0" /> support@vendigo.com</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-light shrink-0" /> +91 1800-VENDIGO</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 VENDIGO Inc. All rights reserved. Swiggy/Zomato inspired minimalist theme.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for Local Street Food Vendors
          </p>
        </div>
      </div>
    </footer>
  );
};
