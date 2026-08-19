import React from 'react';

export const VindigoLogo = ({ size = 'md', showTagline = false, className = '' }) => {
  const sizeMap = {
    sm:  { img: 'w-8 h-8',   text: 'text-sm',  tagline: 'text-[8px]'  },
    md:  { img: 'w-10 h-10', text: 'text-base', tagline: 'text-[9px]'  },
    lg:  { img: 'w-14 h-14', text: 'text-xl',   tagline: 'text-[10px]' },
    xl:  { img: 'w-24 h-24', text: 'text-3xl',  tagline: 'text-xs'     },
    '2xl': { img: 'w-36 h-36', text: 'text-4xl', tagline: 'text-sm'    },
  };

  const s = sizeMap[size] || sizeMap['md'];

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      {/* Logo Image — black bg is transparent-compatible */}
      <img
        src="/vindigo-logo.png"
        alt="VINDIGO Logo"
        className={`${s.img} object-contain rounded-xl`}
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Brand Name + Tagline */}
      <div className="flex flex-col leading-tight">
        <span className={`${s.text} font-black tracking-tight text-white`}>
          VIND<span className="text-orange-400">I</span>GO
        </span>
        {showTagline && (
          <span className={`${s.tagline} text-slate-400 font-semibold tracking-wide uppercase`}>
            Find. Eat. Support Local.
          </span>
        )}
      </div>
    </div>
  );
};
