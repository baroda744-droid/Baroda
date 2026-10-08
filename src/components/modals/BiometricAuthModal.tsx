import React, { useState, useEffect } from 'react';
import {
  Fingerprint,
  ScanFace,
  ShieldCheck,
  CheckCircle2,
  X,
  Lock,
  KeyRound,
  AlertCircle,
  Smartphone,
} from 'lucide-react';
import { BobSunIcon } from '../BobSunIcon';

interface BiometricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFallbackToMpin?: () => void;
  biometricType?: 'fingerprint' | 'face' | 'both';
  title?: string;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onFallbackToMpin,
  biometricType = 'both',
  title = 'bob World Biometric Unlock',
}) => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Play pleasant banking success chime using Web Audio API
  const playSuccessChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // First note (E5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Second note higher (B5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0.15, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.55);
    } catch {
      // Audio not supported or blocked
    }
  };

  const triggerHaptic = (pattern: number[] = [40, 60, 40]) => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // ignore
    }
  };

  const startScan = () => {
    setScanState('scanning');
    setErrorMessage(null);

    // Simulate realistic sensor reading delay (1.2 seconds)
    setTimeout(() => {
      setScanState('success');
      playSuccessChime();
      triggerHaptic([60, 80, 80]);

      // Complete login after success badge shows
      setTimeout(() => {
        onSuccess();
        setScanState('idle');
      }, 700);
    }, 1200);
  };

  useEffect(() => {
    if (isOpen) {
      // Auto-trigger biometric scan when modal opens
      startScan();
    } else {
      setScanState('idle');
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isFaceMode = biometricType === 'face';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-3 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 border border-slate-100 flex flex-col">
        {/* Top Header */}
        <div className="p-4 bg-linear-to-r from-[#0A2E65] via-[#103b78] to-[#071f45] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs">
              <BobSunIcon size={22} color="#FF6B00" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white tracking-tight">{title}</h3>
              <p className="text-[10px] text-orange-200 font-medium">Bank of Baroda Security Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Biometric Sensor Area */}
        <div className="p-6 text-center flex flex-col items-center">
          {/* Subtitle */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF6B00] text-[11px] font-bold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FIDO2 Device Hardware Keystore</span>
          </div>

          <h4 className="font-extrabold text-base text-[#0A2E65]">
            {isFaceMode ? 'Look into Face Scanner' : 'Touch Biometric Sensor'}
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
            {isFaceMode
              ? 'Hold device at eye level to unlock bob World'
              : 'Hold your registered finger on the sensor to authenticate'}
          </p>

          {/* Central Animated Biometric Icon Pad */}
          <div className="my-6 relative flex items-center justify-center">
            {/* Pulsing radar rings during scanning */}
            {scanState === 'scanning' && (
              <>
                <div className="absolute w-28 h-28 rounded-full border-2 border-orange-400/50 animate-ping" />
                <div className="absolute w-36 h-36 rounded-full bg-orange-500/10 animate-pulse" />
              </>
            )}

            {/* Glowing Icon Base */}
            <button
              type="button"
              onClick={scanState === 'idle' ? startScan : undefined}
              className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 relative overflow-hidden cursor-pointer shadow-lg ${
                scanState === 'success'
                  ? 'bg-emerald-500 text-white shadow-emerald-500/40 ring-4 ring-emerald-200 scale-105'
                  : scanState === 'scanning'
                  ? 'bg-linear-to-br from-[#FF6B00] to-[#E64A00] text-white shadow-orange-500/40 ring-4 ring-orange-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-[#FF6B00] border-2 border-slate-200'
              }`}
            >
              {/* Laser scan line sweep when scanning */}
              {scanState === 'scanning' && (
                <div className="absolute inset-x-0 h-1 bg-white/90 shadow-[0_0_12px_#ffffff] animate-scan-laser pointer-events-none" />
              )}

              {scanState === 'success' ? (
                <CheckCircle2 className="w-12 h-12 text-white animate-in zoom-in duration-200" />
              ) : isFaceMode ? (
                <ScanFace className="w-12 h-12" />
              ) : (
                <Fingerprint className="w-12 h-12" />
              )}
            </button>
          </div>

          {/* Status Text */}
          <div className="min-h-[24px] flex items-center justify-center">
            {scanState === 'scanning' && (
              <span className="text-xs font-bold text-[#FF6B00] animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
                Verifying {isFaceMode ? 'Face ID...' : 'Fingerprint...'}
              </span>
            )}
            {scanState === 'success' && (
              <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Identity Verified • Unlocking Account
              </span>
            )}
            {scanState === 'idle' && (
              <button
                type="button"
                onClick={startScan}
                className="text-xs font-bold text-[#0A2E65] hover:text-[#FF6B00] underline cursor-pointer"
              >
                Tap sensor to retry
              </button>
            )}
            {errorMessage && (
              <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMessage}
              </span>
            )}
          </div>

          {/* Fallback & Cancel Actions */}
          <div className="w-full mt-6 space-y-2 pt-3 border-t border-slate-100">
            {onFallbackToMpin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onFallbackToMpin();
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-[#0A2E65]" />
                <span>Use 4-Digit MPIN Instead</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
