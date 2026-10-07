import React, { useState } from 'react';
import { X, CreditCard, Lock, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';

interface CardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const CardsModal: React.FC<CardsModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  const [showCvv, setShowCvv] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#1c4786] text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Debit & Credit Cards</h3>
              <p className="text-[10px] text-slate-300">bob World Platinum Rupay & Visa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Virtual Card Graphic */}
          <div
            className={`rounded-3xl p-5 text-white shadow-xl relative overflow-hidden transition-all duration-300 ${
              isFrozen
                ? 'bg-linear-to-tr from-slate-700 to-slate-900 grayscale'
                : 'bg-linear-to-tr from-[#0A2E65] via-[#FF6B00] to-[#E64A00]'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="font-black text-sm tracking-wider">BOB WORLD</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                PLATINUM
              </span>
            </div>

            {/* Chip & contactless */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-7 rounded-md bg-amber-300/80 border border-amber-400 flex items-center justify-center">
                <div className="w-6 h-4 border border-amber-600/40 rounded-xs" />
              </div>
              <span className="text-sm font-mono tracking-widest opacity-80">)))</span>
            </div>

            <p className="font-mono text-base sm:text-lg tracking-widest font-bold">
              4521 •••• •••• 9081
            </p>

            <div className="flex justify-between items-end mt-4 text-xs font-mono">
              <div>
                <p className="text-[9px] uppercase tracking-wider opacity-70">Card Holder</p>
                <p className="font-bold">AARYA PATEL</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider opacity-70">VALID THRU</p>
                <p className="font-bold">08/29</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider opacity-70">CVV</p>
                <p className="font-bold">{showCvv ? '418' : '•••'}</p>
              </div>
            </div>
          </div>

          {/* Quick Card Controls */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setShowCvv(!showCvv)}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-orange-50 border border-slate-200 flex items-center justify-center gap-2 font-bold text-slate-700 transition-colors"
            >
              {showCvv ? <EyeOff className="w-4 h-4 text-[#FF6B00]" /> : <Eye className="w-4 h-4 text-[#FF6B00]" />}
              <span>{showCvv ? 'Hide CVV' : 'View CVV'}</span>
            </button>

            <button
              onClick={() => {
                const nextState = !isFrozen;
                setIsFrozen(nextState);
                onToast(nextState ? 'Card temporarily locked / frozen!' : 'Card unlocked successfully!', 'warning');
              }}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold transition-colors ${
                isFrozen
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-50 hover:bg-red-50 text-slate-700 border-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isFrozen ? 'Unlock Card' : 'Freeze Card'}</span>
            </button>
          </div>

          {/* Card Limits */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700">ATM Cash Withdrawal</span>
              <span className="font-bold text-[#0A2E65]">₹50,000 / day</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700">POS / Online Purchases</span>
              <span className="font-bold text-[#0A2E65]">₹2,00,000 / day</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700">International Usage</span>
              <span className="font-bold text-emerald-600">Enabled</span>
            </div>
          </div>

          <button
            onClick={() => {
              onToast('PIN change OTP sent to your registered mobile number.', 'info');
              onClose();
            }}
            className="w-full py-3 bg-[#0A2E65] text-white font-bold rounded-xl text-xs shadow-md"
          >
            Manage Card PIN & Limits
          </button>
        </div>
      </div>
    </div>
  );
};
