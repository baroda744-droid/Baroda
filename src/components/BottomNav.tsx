import React from 'react';
import { Home, BookOpen, QrCode, CreditCard, Menu } from 'lucide-react';
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
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 z-40 shadow-lg">
      <div className="grid grid-cols-5 items-center">
        {/* 1. Home */}
        <button
          onClick={() => {
            onNavTabChange('home');
            onNavigate('dashboard');
          }}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            currentScreen === 'dashboard' && activeNavTab === 'home'
              ? 'text-[#FF6B00] font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
          {currentScreen === 'dashboard' && activeNavTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-0.5" />
          )}
        </button>

        {/* 2. M-Passbook (Exact BoB World position) */}
        <button
          onClick={() => {
            onNavTabChange('passbook');
            onNavigate('mpassbook');
          }}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            currentScreen === 'mpassbook'
              ? 'text-[#FF6B00] font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">M-Passbook</span>
          {currentScreen === 'mpassbook' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-0.5" />
          )}
        </button>

        {/* 3. UPI Scan & Pay (Special elevated icon like BoB World) */}
        <button
          onClick={() => {
            onNavTabChange('upi');
            onOpenUpiScan();
          }}
          className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#FF6B00] transition-colors relative cursor-pointer"
        >
          <div className="w-9 h-9 -mt-3 rounded-full bg-linear-to-tr from-[#FF6B00] to-[#FF4D00] text-white flex items-center justify-center shadow-md shadow-orange-500/30 active:scale-95 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold text-slate-700 mt-0.5">UPI</span>
        </button>

        {/* 4. Cards */}
        <button
          onClick={() => {
            onNavTabChange('cards');
            onOpenCards();
          }}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeNavTab === 'cards'
              ? 'text-[#FF6B00] font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <CreditCard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Cards</span>
        </button>

        {/* 5. More */}
        <button
          onClick={() => {
            onNavTabChange('more');
            onOpenMore();
          }}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeNavTab === 'more'
              ? 'text-[#FF6B00] font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>
      </div>
    </nav>
  );
};
