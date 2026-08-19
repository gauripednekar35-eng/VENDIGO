import React, { useEffect, useState } from 'react';
import { VindigoLogo } from '../components/common/VindigoLogo';

export const SplashScreen = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
    }, 700);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 950);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-[#0B0F17] text-white transition-opacity duration-300 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="pt-10 px-6 flex justify-between items-center text-xs tracking-wider text-slate-300 font-semibold">
        <span>BANGALORE • MUMBAI</span>
        <span className="text-orange font-bold">STREET FOOD APP</span>
      </div>

      <div className="flex flex-col items-center justify-center text-center px-6 my-auto">
        <VindigoLogo size="xl" showTagline={true} className="flex-col space-x-0 space-y-4" />
      </div>

      <div className="pb-10 px-6 flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-orange animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-orange animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
