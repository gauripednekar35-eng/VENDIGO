import React from 'react';
import { INITIAL_OFFERS } from '../../data/mockData';
import { Tag, Copy, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OffersBanner = () => {
  const { showToast } = useAuth();
  const [copiedCode, setCopiedCode] = React.useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Promo code "${code}" copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="mb-10 space-y-3">
      <div className="flex items-center space-x-2">
        <Tag className="w-5 h-5 text-secondary" />
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Best Deals & Vendor Coupons</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INITIAL_OFFERS.map(offer => (
          <div
            key={offer.id}
            className={`p-5 rounded-2xl bg-gradient-to-r ${offer.bgGradient} text-white shadow-card relative overflow-hidden flex flex-col justify-between group`}
          >
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform">
              <Tag className="w-32 h-32 text-white" />
            </div>

            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                Exclusive
              </span>
              <h3 className="text-xl font-black">{offer.discount}</h3>
              <p className="text-xs text-white/80">{offer.description}</p>
            </div>

            <div className="pt-4 flex items-center justify-between relative z-10">
              <span className="font-mono text-xs font-extrabold tracking-wider bg-black/20 px-3 py-1 rounded-lg border border-white/20">
                {offer.code}
              </span>
              <button
                onClick={() => handleCopyCode(offer.code)}
                className="px-3 py-1 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center space-x-1 shadow-sm"
              >
                {copiedCode === offer.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-primary" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
