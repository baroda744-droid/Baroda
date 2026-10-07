import React from 'react';
import { Home, CreditCard, MoreHorizontal } from 'lucide-react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  activeNavTab: 'home' | 'passbook' | 'upi' | 'cards' | 'analytics' | 'more';
  onNavTabChange: (tab: 'home' | 'passbook' | 'upi' | 'cards' | 'analytics' | 'more') => void;
  onOpenUpiScan: () => void;
  onOpenCards: () => void;
  onOpenMore: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  activeNavTab,
  onNavTabChange,
  onOpenUpiScan,
  onOpenCards,
  onOpenMore,
}) => {
  const isPassbookActive = currentScreen === 'mpassbook' || activeNavTab === 'passbook';
  const isHomeActive = currentScreen === 'dashboard' && activeNavTab === 'home';
  const isCardsActive = activeNavTab === 'cards';
  const isMoreActive = activeNavTab === 'more';

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-slate-100 px-3 py-2 z-40 shadow-2xl">
      <div className="grid grid-cols-5 items-center">
        {/* 1. Home */}
        <button
          onClick={() => {
            onNavTabChange('home');
            onNavigate('dashboard');
          }}
          className={`flex flex-col items-center justify-center py-0.5 transition-colors cursor-pointer ${
            isHomeActive
              ? 'text-[#FF6B00] font-bold'
              : 'text-slate-400 hover:text-slate-700 font-medium'
          }`}
        >
          <Home className="w-6 h-6 stroke-[1.8] mb-0.5" />
          <span className="text-[11px] leading-tight">Home</span>
        </button>

        {/* 2. M-Passbook (Exact BoB World position & active state) */}
        <button
          onClick={() => {
            onNavTabChange('passbook');
            onNavigate('mpassbook');
          }}
          className={`flex flex-col items-center justify-center py-0.5 transition-colors cursor-pointer relative ${
            isPassbookActive
              ? 'text-[#FF6B00] font-bold'
              : 'text-slate-400 hover:text-slate-700 font-medium'
          }`}
        >
          {/* Top orange dot indicator as in reference image */}
          {isPassbookActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mb-0.5" />
          )}

          {/* Notebook / passbook icon */}
          <svg
            className={`w-6 h-6 ${isPassbookActive ? 'text-[#FF6B00]' : 'text-slate-400'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
          >
            <rect x="4" y="4.5" width="16" height="16" rx="2.5" />
            <line x1="8" y1="2" x2="8" y2="5" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="16" y1="2" x2="16" y2="5" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="4" y1="9.5" x2="20" y2="9.5" />
            <circle cx="8" cy="14" r="0.9" fill="currentColor" />
            <circle cx="12" cy="14" r="0.9" fill="currentColor" />
            <circle cx="16" cy="14" r="0.9" fill="currentColor" />
          </svg>
          <span className="text-[11px] leading-tight mt-0.5">M-Passbook</span>
        </button>

        {/* 3. UPI (Elevated orange circular badge with double curved arrows) */}
        <button
          onClick={() => {
            onNavTabChange('upi');
            onOpenUpiScan();
          }}
          className="flex flex-col items-center justify-center py-0.5 transition-colors relative cursor-pointer group"
        >
          <div className="w-12 h-12 -mt-5 rounded-full bg-linear-to-b from-[#FF6B00] to-[#E64A00] border-2 border-white shadow-md flex items-center justify-center active:scale-95 transition-transform">
            <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
              <path
                d="M11 20 C11 15 15 11 20 11 L23 11 M21 8 L24.5 11 L21 14"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M29 20 C29 25 25 29 20 29 L17 29 M19 32 L15.5 29 L19 26"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x="20"
                y="23.5"
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="900"
                fontFamily="system-ui, sans-serif"
              >
                UPI
              </text>
            </svg>
          </div>
          <span className="text-[11px] font-bold text-[#FF6B00] mt-0.5 leading-tight">UPI</span>
        </button>

        {/* 4. Cards */}
        <button
          onClick={() => {
            onNavTabChange('cards');
            onOpenCards();
          }}
          className={`flex flex-col items-center justify-center py-0.5 transition-colors cursor-pointer ${
            isCardsActive
              ? 'text-[#FF6B00] font-bold'
              : 'text-slate-400 hover:text-slate-700 font-medium'
          }`}
        >
          <CreditCard className="w-6 h-6 stroke-[1.8] mb-0.5" />
          <span className="text-[11px] leading-tight">Cards</span>
        </button>

        {/* 5. More */}
        <button
          onClick={() => {
            onNavTabChange('more');
            onOpenMore();
          }}
          className={`flex flex-col items-center justify-center py-0.5 transition-colors cursor-pointer ${
            isMoreActive
              ? 'text-[#FF6B00] font-bold'
              : 'text-slate-400 hover:text-slate-700 font-medium'
          }`}
        >
          <MoreHorizontal className="w-6 h-6 stroke-[1.8] mb-0.5" />
          <span className="text-[11px] leading-tight">More</span>
        </button>
      </div>
    </nav>
  );
};
