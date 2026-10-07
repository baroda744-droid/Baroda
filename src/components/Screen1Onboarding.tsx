import React, { useState } from 'react';
import { Sparkles, ArrowRight, Shield, CheckCircle2, X } from 'lucide-react';
import { AaryaLogo } from './AaryaLogo';
import { BobSunIcon } from './BobSunIcon';

interface Screen1Props {
  onLoginClick: () => void;
  onExploreFeature?: (title: string, desc: string) => void;
}

export const Screen1Onboarding: React.FC<Screen1Props> = ({
  onLoginClick,
}) => {
  const [selectedOnboardOption, setSelectedOnboardOption] = useState<{
    title: string;
    description: string;
    features: string[];
    actionLabel: string;
  } | null>(null);

  const handleCardClick = (type: 'savings' | 'fd' | 'loan') => {
    if (type === 'savings') {
      setSelectedOnboardOption({
        title: 'Open bob Digital Savings Account',
        description: 'Instant zero-balance or privilege account in under 3 minutes via Aadhaar & Video KYC.',
        features: [
          'Zero balance requirement option',
          'Instant Virtual Platinum RuPay Debit Card',
          'Up to 4.00% p.a. interest calculated daily',
          'Complimentary airport lounge access',
        ],
        actionLabel: 'Proceed with Video KYC',
      });
    } else if (type === 'fd') {
      setSelectedOnboardOption({
        title: 'Start a High-Yield Fixed Deposit',
        description: 'Lock in industry-leading returns with automated compounding and instant liquidity.',
        features: [
          'Earn up to 7.85% p.a. on 2 to 3-year tenures',
          'Senior citizens get +0.50% extra interest',
          'Zero penalty on premature withdrawal after 6 months',
          'Instant overdraft loan facility up to 90%',
        ],
        actionLabel: 'Calculate & Book FD',
      });
    } else {
      setSelectedOnboardOption({
        title: 'Get an Instant Digital Personal Loan',
        description: 'Pre-approved paperless loan credited to your bank account within 60 seconds.',
        features: [
          'Loan amounts up to ₹10,00,000 instantly',
          'Attractive interest rates starting at 10.25% p.a.',
          'Zero physical documentation required',
          'Flexible repayment tenures from 12 to 60 months',
        ],
        actionLabel: 'Check Eligibility Instantly',
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-b from-[#FF6B00] via-[#FF5500] to-[#E64A00] text-white flex flex-col justify-between p-4 sm:p-6 overflow-x-hidden">
      {/* Decorative background glow rings */}
      <div className="absolute top-[-50px] right-[-50px] w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute top-1/3 left-[-60px] w-64 h-64 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

      {/* TOP HEADER SECTION */}
      <div className="relative z-10 pt-3 text-center">
        {/* LARGE UPLOADED B LOGO (orange B with sun rays) */}
        <div className="mb-3 flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-xl shadow-black/15 flex items-center justify-center p-3.5 border-2 border-white/60 hover:scale-105 transition-transform">
            <BobSunIcon size={64} color="#FF6B00" />
          </div>
        </div>

        {/* Small subtitle */}
        <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-white/90 uppercase mb-1">
          START YOUR JOURNEY WITH
        </p>

        {/* Big Bold White Title */}
        <h1 className="text-2xl sm:text-[28px] font-black tracking-tight text-white uppercase drop-shadow-sm">
          BOB WORLD
        </h1>

        {/* White Divider Line */}
        <div className="w-28 sm:w-36 h-[2px] bg-white/80 mx-auto my-2 rounded-full shadow-xs" />

        {/* OPEN • SAVE • GROW Spaced */}
        <p className="text-xs sm:text-sm font-bold tracking-[0.25em] sm:tracking-[0.35em] text-white uppercase">
          OPEN • SAVE • GROW
        </p>

        {/* Subtext centered */}
        <p className="text-xs sm:text-sm text-white/90 max-w-xs mx-auto mt-2 leading-relaxed">
          Open your account in minutes and start banking instantly with Bank of Baroda.
        </p>
      </div>

      {/* MIDDLE SECTION - 3 WHITE CARDS */}
      <div className="relative z-10 my-4 sm:my-5">
        <h2 className="text-xs sm:text-sm font-bold tracking-wider text-center text-white uppercase mb-3 px-2">
          NEW TO BOB WORLD? CHOOSE HOW YOU'D LIKE TO BEGIN
        </h2>

        {/* 3 White Cards Grid / Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
          {/* Card 1: Open Savings Account */}
          <button
            onClick={() => handleCardClick('savings')}
            className="group bg-white rounded-2xl p-2.5 sm:p-3 text-slate-800 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-200 flex flex-col items-center text-center justify-between min-h-[125px] sm:min-h-[140px] border border-orange-100 cursor-pointer"
          >
            {/* Rupee hands icon */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white transition-colors flex items-center justify-center shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8L15 13" />
                <path d="M12 2v4" />
                <path d="M16 6H8" />
                <path d="M15 9H9" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-[11px] font-extrabold leading-tight text-slate-800 uppercase mt-2 group-hover:text-[#FF6B00]">
              OPEN A SAVINGS ACCOUNT
            </span>
            <span className="text-[9px] text-[#FF6B00] font-bold mt-1 opacity-90 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Instant KYC &gt;
            </span>
          </button>

          {/* Card 2: Start a Fixed Deposit */}
          <button
            onClick={() => handleCardClick('fd')}
            className="group bg-white rounded-2xl p-2.5 sm:p-3 text-slate-800 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-200 flex flex-col items-center text-center justify-between min-h-[125px] sm:min-h-[140px] border border-orange-100 cursor-pointer"
          >
            {/* Card rupee icon */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white transition-colors flex items-center justify-center shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
                <circle cx="12" cy="15" r="2" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-[11px] font-extrabold leading-tight text-slate-800 uppercase mt-2 group-hover:text-[#FF6B00]">
              START A FIXED DEPOSIT
            </span>
            <span className="text-[9px] text-[#FF6B00] font-bold mt-1 opacity-90 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Up to 7.85% &gt;
            </span>
          </button>

          {/* Card 3: Get a Digital Loan */}
          <button
            onClick={() => handleCardClick('loan')}
            className="group bg-white rounded-2xl p-2.5 sm:p-3 text-slate-800 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-200 flex flex-col items-center text-center justify-between min-h-[125px] sm:min-h-[140px] border border-orange-100 cursor-pointer"
          >
            {/* Phone rupee icon */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white transition-colors flex items-center justify-center shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <rect width="14" height="20" x="5" y="2" rx="2" />
                <path d="M12 18h.01" />
                <path d="M10 7h4" />
                <path d="M10 10h4" />
                <path d="M12 7v7" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-[11px] font-extrabold leading-tight text-slate-800 uppercase mt-2 group-hover:text-[#FF6B00]">
              GET A DIGITAL LOAN
            </span>
            <span className="text-[9px] text-[#FF6B00] font-bold mt-1 opacity-90 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              In 60 Sec &gt;
            </span>
          </button>
        </div>
      </div>

      {/* BOTTOM PHONE MOCK SECTION */}
      <div className="relative z-10 max-w-md mx-auto w-full pb-2">
        {/* White Phone Card Container */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 text-slate-800 shadow-2xl shadow-black/25 border-2 border-white/40">
          {/* Welcome Header with Uploaded B Logo */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Welcome to
              </p>
              <h3 className="text-base font-extrabold text-[#0A2E65] tracking-tight">
                bob World
              </h3>
            </div>
            <AaryaLogo size="sm" showSubtitle={false} />
          </div>

          {/* Dark Blue Bar "Existing Customer?" */}
          <div className="mt-3.5 bg-[#0A2E65] rounded-xl px-3.5 py-2 flex items-center justify-between text-white shadow-xs">
            <span className="text-xs font-bold tracking-wide flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-orange-400" />
              Existing Customer?
            </span>
            <span className="text-[10px] font-semibold text-orange-300 bg-white/10 px-2 py-0.5 rounded-full">
              Instant Access
            </span>
          </div>

          {/* Grey Explanation Text */}
          <p className="mt-2 text-[11px] sm:text-xs text-slate-500 leading-relaxed px-0.5">
            Access your accounts effortlessly with MPIN, Biometrics, or Internet Banking credentials.
          </p>

          {/* Dark Blue Login Button */}
          <button
            onClick={onLoginClick}
            className="mt-3.5 w-full py-3.5 px-4 rounded-xl bg-[#0A2E65] hover:bg-[#071f45] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-md shadow-blue-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <span>Login to bob World</span>
            <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Quick links below button */}
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-500 px-1">
            <button
              onClick={() => handleCardClick('savings')}
              className="hover:text-[#FF6B00] transition-colors"
            >
              Open New A/C
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={onLoginClick}
              className="hover:text-[#FF6B00] transition-colors"
            >
              Forgot MPIN?
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => alert('Bank of Baroda 24x7 Customer Care: 1800 5700 / care@bankofbaroda.com')}
              className="hover:text-[#FF6B00] transition-colors"
            >
              24x7 Help
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Modal for New Account / FD / Loan options */}
      {selectedOnboardOption && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-800 rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-[#0A2E65]">
                  Instant Digital Onboarding
                </h4>
              </div>
              <button
                onClick={() => setSelectedOnboardOption(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {selectedOnboardOption.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {selectedOnboardOption.description}
              </p>

              <div className="mt-3 space-y-2 bg-orange-50/60 p-3 rounded-2xl border border-orange-100">
                {selectedOnboardOption.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedOnboardOption(null);
                    onLoginClick();
                  }}
                  className="flex-1 py-3 px-4 bg-[#FF6B00] hover:bg-[#e65a00] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all text-center cursor-pointer"
                >
                  {selectedOnboardOption.actionLabel}
                </button>
                <button
                  onClick={() => setSelectedOnboardOption(null)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
