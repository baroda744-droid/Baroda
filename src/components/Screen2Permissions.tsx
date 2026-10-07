import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Check, ShieldCheck, Lock } from 'lucide-react';
import { AaryaLogo } from './AaryaLogo';

interface Screen2Props {
  onConfirm: () => void;
  onBackToStart?: () => void;
}

export const Screen2Permissions: React.FC<Screen2Props> = ({
  onConfirm,
  onBackToStart,
}) => {
  const [permissions, setPermissions] = useState({
    phone: true,
    sms: true,
    location: true,
  });

  const togglePerm = (key: 'phone' | 'sms' | 'location') => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#FFF6F0] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Top Brand Nav */}
      <div className="flex items-center justify-between pb-2 border-b border-orange-200/60 max-w-md mx-auto w-full">
        <AaryaLogo size="sm" showSubtitle={true} />
        {onBackToStart && (
          <button
            onClick={onBackToStart}
            className="text-xs font-semibold text-slate-500 hover:text-[#FF6B00] px-2 py-1"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Main Center Card with Orange side borders (#FF6B00 left + right) */}
      <div className="max-w-md mx-auto w-full my-auto py-2">
        <div className="bg-white rounded-3xl shadow-2xl shadow-orange-950/10 border-l-[6px] border-r-[6px] border-l-[#FF6B00] border-r-[#FF6B00] border-t border-b border-t-orange-100 border-b-orange-100 p-5 sm:p-7 relative overflow-hidden">
          {/* Subtle top badge */}
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6B00]">
              <ShieldCheck className="w-3.5 h-3.5" />
              RBI & Bank Grade Security
            </span>
          </div>

          {/* Title as specified in requirements */}
          <h2 className="text-base sm:text-lg font-extrabold text-[#0A2E65] text-center leading-snug px-1">
            App permissions - Please grant phone, SMS and location permissions to proceed
          </h2>

          {/* ILLUSTRATION: Woman standing with big red/orange phone with lock tick, call, sms, location icons floating around in blue circles */}
          <div className="my-5 flex items-center justify-center relative">
            <div className="w-full max-w-[260px] h-[190px] relative flex items-center justify-center">
              {/* Background soft circle */}
              <div className="absolute inset-4 rounded-full bg-linear-to-tr from-orange-100/70 to-blue-50/70 -z-10" />

              {/* Floating Blue Circle 1: Call / Phone */}
              <div className="absolute top-2 left-3 w-10 h-10 rounded-full bg-[#0A2E65] text-white flex items-center justify-center shadow-lg shadow-blue-900/30 animate-bounce duration-1000">
                <Phone className="w-4 h-4 text-orange-300" />
              </div>

              {/* Floating Blue Circle 2: SMS */}
              <div className="absolute top-4 right-3 w-10 h-10 rounded-full bg-[#0A2E65] text-white flex items-center justify-center shadow-lg shadow-blue-900/30 animate-pulse">
                <MessageSquare className="w-4 h-4 text-emerald-300" />
              </div>

              {/* Floating Blue Circle 3: Location */}
              <div className="absolute bottom-4 left-4 w-9 h-9 rounded-full bg-[#0A2E65] text-white flex items-center justify-center shadow-lg shadow-blue-900/30">
                <MapPin className="w-4 h-4 text-amber-300" />
              </div>

              {/* Vector SVG: Woman standing next to large red/orange phone with lock tick */}
              <svg
                viewBox="0 0 200 160"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ground shadow */}
                <ellipse cx="100" cy="150" rx="80" ry="8" fill="#E2E8F0" opacity="0.7" />

                {/* Big Red/Orange Phone standing */}
                <rect
                  x="48"
                  y="20"
                  width="70"
                  height="125"
                  rx="14"
                  fill="#FF4D00"
                  stroke="#0A2E65"
                  strokeWidth="3"
                />
                <rect x="53" y="26" width="60" height="113" rx="10" fill="#FFFFFF" />

                {/* Phone screen elements */}
                <rect x="63" y="32" width="40" height="4" rx="2" fill="#E2E8F0" />
                
                {/* Large Lock with Check / Tick on Phone Screen */}
                <circle cx="83" cy="75" r="22" fill="#0A2E65" />
                <path
                  d="M77 68V62C77 58.7 79.7 56 83 56C86.3 56 89 58.7 89 62V68"
                  stroke="#FF6B00"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <rect x="73" y="68" width="20" height="15" rx="3" fill="#FF6B00" />
                <path
                  d="M78 76L81.5 79.5L88 73"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Status bar lines on phone */}
                <rect x="60" y="105" width="46" height="4" rx="2" fill="#E2E8F0" />
                <rect x="66" y="113" width="34" height="4" rx="2" fill="#FF6B00" opacity="0.6" />
                <circle cx="83" cy="128" r="4" fill="#0A2E65" />

                {/* Woman standing to the right */}
                {/* Woman hair & head */}
                <circle cx="140" cy="38" r="11" fill="#4A2E18" />
                <circle cx="140" cy="40" r="9" fill="#FBBF24" />
                {/* Ponytail / hair styling */}
                <path
                  d="M145 36C153 38 156 46 153 54"
                  stroke="#4A2E18"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Face feature */}
                <circle cx="137" cy="40" r="1" fill="#78350F" />
                {/* Jacket / Torso */}
                <path
                  d="M130 52C130 52 135 50 140 50C145 50 150 52 150 52L152 82C152 82 143 85 140 85C137 85 128 82 128 82L130 52Z"
                  fill="#0A2E65"
                />
                {/* Inner top (orange accent) */}
                <path d="M136 50L140 58L144 50Z" fill="#FF6B00" />
                {/* Hand pointing to phone */}
                <path
                  d="M130 60L112 68"
                  stroke="#FBBF24"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M148 60L154 75"
                  stroke="#0A2E65"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Pants */}
                <path
                  d="M133 83L132 135L138 135L140 95L142 135L148 135L147 83"
                  fill="#1E293B"
                />
                {/* Shoes */}
                <ellipse cx="133" cy="138" rx="5" ry="2.5" fill="#FF6B00" />
                <ellipse cx="147" cy="138" rx="5" ry="2.5" fill="#FF6B00" />
              </svg>
            </div>
          </div>

          {/* Interactive Permission Toggles */}
          <div className="space-y-2.5 my-4">
            {/* Phone */}
            <div
              onClick={() => togglePerm('phone')}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50/50 cursor-pointer transition-colors border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0A2E65] flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Phone Permission</h4>
                  <p className="text-[10px] text-slate-500">Required for device SIM binding & security</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  permissions.phone ? 'bg-[#FF6B00] text-white' : 'border border-slate-300'
                }`}
              >
                {permissions.phone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* SMS */}
            <div
              onClick={() => togglePerm('sms')}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50/50 cursor-pointer transition-colors border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0A2E65] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">SMS Permission</h4>
                  <p className="text-[10px] text-slate-500">Auto-read OTP & prevent transactional fraud</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  permissions.sms ? 'bg-[#FF6B00] text-white' : 'border border-slate-300'
                }`}
              >
                {permissions.sms && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Location */}
            <div
              onClick={() => togglePerm('location')}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50/50 cursor-pointer transition-colors border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0A2E65] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Location Permission</h4>
                  <p className="text-[10px] text-slate-500">Locate nearest branch/ATM and secure geo-login</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  permissions.location ? 'bg-[#FF6B00] text-white' : 'border border-slate-300'
                }`}
              >
                {permissions.location && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center mb-4">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Your data is strictly encrypted and never shared.</span>
          </div>

          {/* Dark Blue Button "Okay" full width rounded #0A2E65 -> on click go to Screen 3 */}
          <button
            onClick={onConfirm}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#0A2E65] hover:bg-[#071f45] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Okay</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="text-center text-[11px] text-slate-400 max-w-md mx-auto w-full pb-1">
        bob World (Bank of Baroda) respects your privacy. You can modify permissions anytime in Settings.
      </div>
    </div>
  );
};
