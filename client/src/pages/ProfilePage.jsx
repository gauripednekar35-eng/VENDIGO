import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, LogOut, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile, logout, role } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || 'Indiranagar, Bangalore'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in text-white">
      
      <div className="bg-[#1E293B] rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6">
        
        {/* Header Profile Avatar */}
        <div className="flex items-center space-x-4 border-b border-slate-700 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{user?.name || 'Street Food Enthusiast'}</h1>
            <p className="text-xs text-slate-300 font-semibold">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold uppercase">
              ROLE: {role}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-400" /> Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-sm p-3.5 rounded-xl bg-[#0F172A] border border-slate-600 text-white font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-400" /> Email Address
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full text-sm p-3.5 rounded-xl bg-[#0B0F17] border border-slate-800 text-slate-400 font-bold cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400" /> Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-sm p-3.5 rounded-xl bg-[#0F172A] border border-slate-600 text-white font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" /> Preferred Delivery Location
            </label>
            <textarea
              rows="3"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full text-sm p-3.5 rounded-xl bg-[#0F172A] border border-slate-600 text-white font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={logout}
              className="px-5 py-3 rounded-xl text-red-400 border border-red-500/40 hover:bg-red-500/20 text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-900/50 flex items-center space-x-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
