import React, { useState } from 'react';
import { X, Lock, Fingerprint, ScanFace, Delete, ShieldAlert } from 'lucide-react';
import { AaryaLogo } from '../AaryaLogo';
import { BobSunIcon } from '../BobSunIcon';

interface MpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onTriggerBiometric?: () => void;
  title?: string;
  subtitle?: string;
}

export const MpinModal: React.FC<MpinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onTriggerBiometric,
  title = 'Enter 4-Digit Login MPIN',
  subtitle = 'Welcome back to bob World Mobile Banking',
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(null);

      if (nextPin.length === 4) {
        if (nextPin === '1999') {
          setTimeout(() => {
            onSuccess();
            setPin('');
            setError(null);
          }, 300);
        } else {
          setError('Incorrect MPIN. Please enter correct 4-digit PIN (1999).');
          setTimeout(() => {
            setPin('');
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const isBiometricEnabled = (() => {
    try {
      return localStorage.getItem('bob_biometric_enabled') === 'true';
    } catch {
      return false;
    }
  })();

  const biometricType = (() => {
    try {
      return localStorage.getItem('bob_biometric_type') || 'both';
    } catch {
      return 'both';
    }
  })();

  const handleBiometric = () => {
    if (!isBiometricEnabled) {
      setError('Biometric unlock is disabled. Enable it in Profile Settings.');
      return;
    }
    if (onTriggerBiometric) {
      onTriggerBiometric();
    } else {
      onSuccess();
    }
    setPin('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-3 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Top Header */}
        <div className="p-4 bg-linear-to-r from-[#FF6B00] to-[#FF4D00] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs">
              <BobSunIcon size={24} color="#FF6B00" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">bob World Security</h3>
              <p className="text-[10px] text-white/80">Bank of Baroda 256-Bit SSL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Indicators */}
        <div className="p-5 text-center">
          <h4 className="font-extrabold text-base text-[#0A2E65]">{title}</h4>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>

          {/* 4 dots */}
          <div className="flex items-center justify-center gap-4 my-6">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-150 ${
                    isFilled
                      ? 'bg-[#FF6B00] scale-125 shadow-md shadow-orange-500/40 ring-4 ring-orange-100'
                      : 'border-2 border-slate-300 bg-slate-100'
                  }`}
                />
              );
            })}
          </div>

          {error && (
            <p className="text-xs text-red-500 font-semibold mb-3">{error}</p>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="w-16 h-14 rounded-2xl bg-slate-50 hover:bg-orange-50 active:bg-orange-100 text-slate-800 hover:text-[#FF6B00] font-bold text-xl shadow-xs border border-slate-200/80 transition-all flex items-center justify-center mx-auto active:scale-95 cursor-pointer"
              >
                {digit}
              </button>
            ))}

            {/* Biometric button */}
            <button
              type="button"
              onClick={handleBiometric}
              className={`w-16 h-14 rounded-2xl font-semibold text-xs shadow-xs border transition-all flex flex-col items-center justify-center mx-auto active:scale-95 cursor-pointer ${
                isBiometricEnabled
                  ? 'bg-orange-50 hover:bg-orange-100 text-[#FF6B00] border-orange-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-400 border-slate-200/80 opacity-60'
              }`}
              title={
                isBiometricEnabled
                  ? biometricType === 'face'
                    ? 'Unlock with Face ID'
                    : 'Unlock with Fingerprint'
                  : 'Biometric unlock disabled in Profile Settings'
              }
            >
              {biometricType === 'face' ? (
                <ScanFace className="w-5 h-5 text-[#FF6B00]" />
              ) : (
                <Fingerprint className={`w-5 h-5 ${isBiometricEnabled ? 'text-[#FF6B00]' : 'text-slate-400'}`} />
              )}
              <span className="text-[8px] font-bold mt-0.5">
                {isBiometricEnabled ? (biometricType === 'face' ? 'Face ID' : 'Touch ID') : 'Off'}
              </span>
            </button>

            {/* 0 */}
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="w-16 h-14 rounded-2xl bg-slate-50 hover:bg-orange-50 active:bg-orange-100 text-slate-800 hover:text-[#FF6B00] font-bold text-xl shadow-xs border border-slate-200/80 transition-all flex items-center justify-center mx-auto active:scale-95 cursor-pointer"
            >
              0
            </button>

            {/* Backspace */}
            <button
              type="button"
              onClick={handleDelete}
              className="w-16 h-14 rounded-2xl bg-slate-50 hover:bg-red-50 active:bg-red-100 text-slate-600 hover:text-red-600 font-bold text-sm shadow-xs border border-slate-200/80 transition-all flex items-center justify-center mx-auto active:scale-95 cursor-pointer"
              title="Backspace"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center text-xs text-slate-500 px-2">
            <button
              type="button"
              onClick={() => {
                setError('OTP sent to registered mobile (+91 98*** ***56) to reset MPIN.');
              }}
              className="text-[#FF6B00] font-semibold hover:underline"
            >
              Forgot MPIN?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
