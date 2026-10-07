import React from 'react';
import { BobSunIcon } from './BobSunIcon';

interface LogoProps {
  variant?: 'light' | 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  showText?: boolean;
}

export const AaryaLogo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  className = '',
  showText = true,
}) => {
  const isWhite = variant === 'white';

  const iconDimension = {
    sm: 24,
    md: 32,
    lg: 44,
    xl: 64,
    hero: 96,
  }[size];

  const titleSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-xl font-black',
    xl: 'text-2xl font-black',
    hero: 'text-3xl font-black',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Uploaded B logo image (orange B with sun rays), transparent background */}
      <BobSunIcon
        size={iconDimension}
        color={isWhite ? '#FFFFFF' : '#FF6B00'}
        className="transition-transform hover:scale-105"
      />

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`${titleSizes[size]} tracking-tight ${
                isWhite ? 'text-white' : 'text-[#FF6B00]'
              }`}
            >
              bob World
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                isWhite
                  ? 'bg-white/20 text-white'
                  : 'bg-orange-100 text-[#FF6B00]'
              }`}
            >
              BOB
            </span>
          </div>
          {showSubtitle && (
            <span
              className={`text-[10px] font-medium tracking-wide ${
                isWhite ? 'text-white/80' : 'text-slate-500'
              }`}
            >
              बैंक ऑफ़ बड़ौदा • Bank of Baroda
            </span>
          )}
        </div>
      )}
    </div>
  );
};
