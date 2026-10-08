import React, { useEffect } from 'react';
import { BobSunIcon } from './BobSunIcon';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    // Total animation runtime: animation finishes around 1.3s, hold 1 sec -> total 2.3s
    const timer = setTimeout(() => {
      onFinish();
    }, 2300);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#FDE8E9] text-slate-800 select-none overflow-hidden font-sans">
      {/* Top spacing */}
      <div className="w-full pt-12" />

      {/* Center Branding Area */}
      <div className="flex flex-col items-center justify-center -mt-8">
        {/* Orange gradient square with scale animation */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-linear-to-br from-[#FF8A20] to-[#E85D04] shadow-2xl shadow-orange-500/30 flex items-center justify-center p-4 animate-splash-square">
          {/* White B Logo fade in */}
          <div className="animate-splash-logo">
            <BobSunIcon size={64} color="#FFFFFF" />
          </div>
        </div>

        {/* "bob World" text fade in */}
        <div className="mt-5 text-center animate-splash-text">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0A2E65] font-sans">
            <span className="text-[#E85D04]">bob</span>{' '}
            <span className="text-[#0A2E65]">World</span>
          </h1>
        </div>
      </div>

      {/* Bottom Footer: "Powered by ai" text fade in */}
      <div className="pb-10 text-center animate-splash-subtext">
        <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 flex items-center justify-center gap-1.5">
          <span>Powered by</span>
          <span className="font-extrabold text-[#E85D04] tracking-normal">ai</span>
        </p>
      </div>
    </div>
  );
};
