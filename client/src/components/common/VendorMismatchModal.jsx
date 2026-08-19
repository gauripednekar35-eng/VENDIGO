import React from 'react';
import { useCart } from '../../context/CartContext';
import { AlertTriangle, X } from 'lucide-react';

export const VendorMismatchModal = () => {
  const { vendorMismatchModal, setVendorMismatchModal, confirmVendorSwitch, activeVendor } = useCart();

  if (!vendorMismatchModal) return null;

  const { vendor } = vendorMismatchModal;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button 
            onClick={() => setVendorMismatchModal(null)}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">Replace items in cart?</h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Your cart already contains items from <span className="font-bold text-slate-900">{activeVendor?.name}</span>. Would you like to clear your cart and add items from <span className="font-bold text-primary">{vendor?.name}</span> instead?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setVendorMismatchModal(null)}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            No, keep existing
          </button>
          <button
            onClick={confirmVendorSwitch}
            className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-md transition-colors"
          >
            Yes, clear & start new
          </button>
        </div>
      </div>
    </div>
  );
};
