import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  Copy,
  Check,
  Phone,
  Mail,
  Building,
  RotateCcw,
  Home,
  ShieldAlert,
  Clock,
  FileText,
  AlertOctagon,
} from 'lucide-react';

interface TransactionFailedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoHome: () => void;
  amount: number;
  recipient?: string;
  mode?: string;
}

export const TransactionFailedModal: React.FC<TransactionFailedModalProps> = ({
  isOpen,
  onClose,
  onGoHome,
  amount,
  recipient = 'Beneficiary',
  mode = 'UPI Transfer',
}) => {
  const [txnId, setTxnId] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  // Play realistic error buzzer tone using Web Audio API
  const playErrorSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Dual tone buzzer (sawtooth 180Hz & 135Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(180, ctx.currentTime);
      osc2.frequency.setValueAtTime(135, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio context blocked
    }
  };

  // Vibration on fail
  const triggerFailVibration = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([250, 80, 250, 80, 400]);
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Generate realistic TXN id: TXN + random 10 digits
      const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
      setTxnId(`TXN${randomDigits}`);

      const now = new Date();
      setTimestamp(
        now.toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );

      setShakeCount((prev) => prev + 1);
      playErrorSound();
      triggerFailVibration();
    }
  }, [isOpen]);

  const handleCopyTxnId = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(txnId);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleTryAgain = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      // Re-trigger sound, vibration, and shake in infinite loop
      playErrorSound();
      triggerFailVibration();
      const newDigits = Math.floor(1000000000 + Math.random() * 9000000000);
      setTxnId(`TXN${newDigits}`);
      setShakeCount((prev) => prev + 1);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        key={`failed-card-${shakeCount}`}
        className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md shadow-2xl overflow-hidden border border-red-100 flex flex-col max-h-[95vh] animate-error-shake"
      >
        
        {/* RETRYING PROCESSING ANIMATION OVERLAY */}
        {isRetrying && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 relative">
              <span className="w-16 h-16 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin absolute" />
              <ShieldAlert className="w-8 h-8 text-[#FF6B00]" />
            </div>
            <h3 className="text-base font-extrabold text-[#0A2E65] mb-1">
              Processing your transaction...
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Please wait while Bank of Baroda CBS verifies your request
            </p>
          </div>
        )}

        {/* TOP: Big Red Cross Animation with "Transaction Failed" and Urgent Shake Effect */}
        <div className="pt-6 pb-4 px-6 text-center bg-linear-to-b from-red-50/80 via-white to-white flex flex-col items-center">
          {/* Animated Red Cross ❌ Icon Container with Urgent Pop & Shake */}
          <div
            key={`shake-icon-${shakeCount}`}
            className="relative mb-3 flex items-center justify-center animate-icon-pop-shake"
          >
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <div className="w-15 h-15 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40">
                <X className="w-10 h-10 stroke-[3.5]" />
              </div>
            </div>
            {/* Ping effect ring */}
            <span className="absolute w-22 h-22 rounded-full border-2 border-red-500 animate-ping opacity-30 pointer-events-none" />
          </div>

          <h2 className="text-2xl font-black text-red-600 tracking-tight leading-tight">
            Transaction Failed
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Bank of Baroda CBS Security Gateway
          </p>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="px-5 pb-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
          {/* MIDDLE WARNING CARD: Account Status: FREEZED 🥶 */}
          <div className="bg-linear-to-r from-red-500 to-rose-600 text-white rounded-2xl p-4 shadow-md shadow-red-950/15 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 text-xl">
                ⚠️
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-black tracking-wide uppercase">
                    Account Status: FREEZED
                  </h3>
                  <span className="text-base">🥶</span>
                </div>
                <p className="text-xs font-medium text-white/95 mt-1 leading-snug">
                  Your account is temporarily freezed due to security reasons.
                </p>
              </div>
            </div>
          </div>

          {/* TRANSACTION & REASON DETAILS */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-2.5 text-[11px]">
            {/* Transaction ID */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Transaction ID:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-slate-900">{txnId}</span>
                <button
                  type="button"
                  onClick={handleCopyTxnId}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Copy Transaction ID"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Amount:</span>
              <span className="font-mono font-black text-red-600 text-sm">
                ₹ {amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Recipient / Mode */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Payment Mode:</span>
              <span className="font-semibold text-slate-800">{mode}</span>
            </div>

            {/* Date & Time */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Date & Time:</span>
              <span className="text-slate-800 font-mono font-medium">{timestamp}</span>
            </div>

            {/* Reason */}
            <div className="pb-2 border-b border-slate-200">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-slate-500 font-medium">Failure Reason:</span>
                <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded-sm">
                  ACCT_FRZ_001
                </span>
              </div>
              <p className="text-red-700 font-bold text-xs mt-0.5">
                Account Freezed - Security Hold (Code: ACCT_FRZ_001)
              </p>
            </div>

            {/* Official Bank Message */}
            <div className="pt-0.5">
              <span className="text-slate-500 font-medium block mb-1">Bank Message:</span>
              <div className="p-2.5 rounded-xl bg-red-100/70 border border-red-200 text-red-900 leading-relaxed font-semibold">
                "Your account is freezed. Cannot debit. Please contact home branch."
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS: [Try Again] [Home] (as requested) + Contact Support link */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              {/* Try Again Button (Infinite retry failure) */}
              <button
                type="button"
                onClick={handleTryAgain}
                className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/15 cursor-pointer transition-all active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4 text-[#FF6B00]" />
                <span>Try Again</span>
              </button>

              {/* Home Button */}
              <button
                type="button"
                onClick={onGoHome}
                className="py-3 px-3 rounded-xl bg-[#0A2E65] hover:bg-[#071f45] text-white font-black flex items-center justify-center gap-2 shadow-md shadow-blue-950/20 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Home className="w-4 h-4 text-orange-400" />
                <span>Home</span>
              </button>
            </div>

            {/* Subtle Contact Support link */}
            <button
              type="button"
              onClick={() => setIsSupportOpen(true)}
              className="w-full py-2 text-center text-xs text-slate-500 hover:text-red-600 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Contact Branch Support (1800-5700)</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONTACT SUPPORT POPUP MODAL */}
      {isSupportOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-xs sm:max-w-sm shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 bg-[#0A2E65] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-orange-400" />
                <h4 className="font-extrabold text-sm">Branch & Security Support</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsSupportOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details */}
            <div className="p-4 space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-200">
                <span className="text-[10px] uppercase font-bold text-red-700 block">
                  Reference Case
                </span>
                <span className="font-mono font-bold text-red-900 block mt-0.5">
                  HOLD_REF: {txnId.replace('TXN', 'BOB_KYC_')}
                </span>
                <p className="text-[11px] text-red-700 mt-1">
                  Security hold placed by Risk Management Cell.
                </p>
              </div>

              {/* Branch Manager Helpline */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    Branch Manager Helpline:
                  </span>
                  <a
                    href="tel:18005700"
                    className="font-mono font-bold text-sm text-[#0A2E65] hover:text-[#FF6B00]"
                  >
                    1800-5700
                  </a>
                </div>
                <a
                  href="tel:18005700"
                  className="p-2.5 rounded-xl bg-[#FF6B00] text-white hover:bg-[#e65c00]"
                  title="Call Now"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              {/* Email Support */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    Customer Support Email:
                  </span>
                  <a
                    href="mailto:bobsupport@branch.com"
                    className="font-mono font-bold text-xs text-[#0A2E65] hover:text-[#FF6B00] break-all"
                  >
                    bobsupport@branch.com
                  </a>
                </div>
                <a
                  href="mailto:bobsupport@branch.com"
                  className="p-2.5 rounded-xl bg-[#0A2E65] text-white hover:bg-[#071f45]"
                  title="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>

              {/* Home Branch Location */}
              <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Home Branch:</span>
                <p>BOB Chennai Main Branch (IFSC: BARB0CHENNA)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Carry Original PAN Card, Aadhaar, & Recent Address Proof for verification.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSupportOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Close Support Information
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
