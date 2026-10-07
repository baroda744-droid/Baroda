import React, { useState } from 'react';
import { Search, Bell, X, ShieldCheck, UserCheck, ChevronRight, LogOut, Check, User } from 'lucide-react';
import { AaryaLogo } from './AaryaLogo';

interface HeaderProps {
  onSearchClick: () => void;
  onNotificationClick: () => void;
  onLogout: () => void;
  onProfileClick?: () => void;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  onNotificationClick,
  onLogout,
  onProfileClick,
  userName = 'Aarya',
}) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="bg-white px-4 py-3 border-b border-orange-100 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left: Aarya World Logo */}
        <AaryaLogo size="md" showSubtitle={true} />

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Button */}
          <button
            onClick={onSearchClick}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-[#FF6B00] hover:bg-orange-50 active:scale-95 transition-all"
            aria-label="Search services"
            title="Search features & services"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Bell Notifications */}
          <button
            onClick={onNotificationClick}
            className="w-9 h-9 rounded-full relative flex items-center justify-center text-slate-600 hover:text-[#FF6B00] hover:bg-orange-50 active:scale-95 transition-all"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4D00] ring-2 ring-white animate-pulse" />
          </button>

          {/* Profile Icon (top right) -> on click go to Profile Page */}
          <button
            onClick={() => {
              if (onProfileClick) {
                onProfileClick();
              } else {
                setProfileOpen(true);
              }
            }}
            className="w-9 h-9 rounded-full bg-linear-to-tr from-[#0A2E65] to-[#1e4a8c] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:ring-2 hover:ring-orange-400 active:scale-95 transition-all cursor-pointer"
            aria-label="My Profile / Account Details"
            title="My Profile / Account Details"
          >
            <User className="w-4 h-4 text-orange-200" />
          </button>
        </div>
      </header>

      {/* User Profile Drawer */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Top Header */}
              <div className="p-5 bg-linear-to-r from-[#0A2E65] to-[#144287] text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-orange-200 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Full KYC Verified</span>
                  </div>
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white text-[#0A2E65] font-black text-xl flex items-center justify-center shadow-lg ring-2 ring-orange-400">
                    AP
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{userName}</h3>
                    <p className="text-xs text-slate-300">Cust ID: 89047128</p>
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-orange-500/30 text-orange-300 font-semibold border border-orange-400/30">
                      ★ bob World Premier Club
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-1">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Account Services
                </div>
                {[
                  { label: 'Manage Profile & Nominees', icon: UserCheck, desc: 'KYC, Address, Nominee' },
                  { label: 'Debit & Virtual Cards', badge: 'Active', desc: 'Rupay Platinum & Visa' },
                  { label: 'UPI & Payment Limits', badge: '₹2,00,000/day', desc: 'Manage transaction limits' },
                  { label: 'Security & Biometrics', badge: 'Enabled', desc: 'Fingerprint, Face ID, MPIN' },
                  { label: 'Statements & Certificates', desc: 'Interest certificate & Form 16A' },
                  { label: '24x7 Customer Care', desc: 'Toll-free 1800 5700' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setProfileOpen(false);
                      if (item.label.includes('Profile') && onProfileClick) {
                        onProfileClick();
                      } else {
                        alert(`${item.label} opened in bob World portal`);
                      }
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800 group-hover:text-[#FF6B00]">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                    {item.badge ? (
                      <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Logout button at bottom */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Lock Session & Log Out</span>
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-2">
                bob World Mobile App v4.8.2 (Bank of Baroda 256-Bit SSL)
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
