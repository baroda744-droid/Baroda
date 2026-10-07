import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Lock,
  Delete,
  Sparkles,
} from 'lucide-react';
import { BankAccount, Transaction } from '../../types';
import { TransactionFailedModal } from './TransactionFailedModal';
import { db, auth, recordFailedTransaction } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface SendToMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryAccount: BankAccount;
  onSuccess?: (tx: Transaction, newBalance: number) => void;
}

export const SendToMobileModal: React.FC<SendToMobileModalProps> = ({
  isOpen,
  onClose,
  primaryAccount,
}) => {
  // Blank inputs - no prefilled default payee
  const [recipientInput, setRecipientInput] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');

  // Flow steps: 'form' -> 'pin' -> 'processing' -> 'failed'
  const [step, setStep] = useState<'form' | 'pin' | 'processing' | 'failed'>('form');
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Real-time verification status based on user input
  const trimmed = recipientInput.trim();
  const is10DigitMobile = /^[6-9]\d{9}$/.test(trimmed);
  const isUpiId = trimmed.includes('@') && trimmed.length >= 5;
  const isValidRecipient = is10DigitMobile || isUpiId;

  // Verified display name simulation
  let verifiedName = '';
  if (is10DigitMobile) {
    verifiedName = `User (${trimmed})`;
  } else if (isUpiId) {
    const handle = trimmed.split('@')[0];
    verifiedName = handle.charAt(0).toUpperCase() + handle.slice(1);
  }

  const numAmount = parseFloat(amount || '0');

  const handleProceedToPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!trimmed) {
      setErrorMessage('Please enter a 10-digit mobile number or UPI ID.');
      return;
    }

    if (!isValidRecipient) {
      setErrorMessage('Please enter a valid 10-digit mobile number (starts with 6-9) or UPI ID (e.g. name@bank).');
      return;
    }

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than ₹0.');
      return;
    }

    setPin('');
    setStep('pin');
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);

      if (nextPin.length === 4) {
        // Automatically start 2-second processing animation
        setStep('processing');
        setTimeout(async () => {
          // Permanently save failed transaction in Firestore
          try {
            const currentUserId = auth.currentUser?.uid || localStorage.getItem('bob_user_uid') || 'user_bob_1234';
            await addDoc(collection(db, "transactions"), {
              userId: currentUserId,
              type: "transfer",
              amount: numAmount,
              toAccount: trimmed,
              status: "failed",
              reason: "Account Freezed - Suspicious Activity",
              date: new Date(),
              timestamp: serverTimestamp(),
              narration: `UPI/DR/To ${verifiedName || trimmed}/FAILED-FRZ`,
              mode: 'UPI',
            });
          } catch (e) {
            await recordFailedTransaction({
              amount: numAmount,
              toAccount: trimmed,
              reason: "Account Freezed - Suspicious Activity",
              type: "transfer",
              mode: 'UPI',
              narration: `UPI/DR/To ${verifiedName || trimmed}/FAILED-FRZ`,
            });
          }
          // ALWAYS fail with Account Freezed
          setStep('failed');
        }, 2000);
      }
    }
  };

  const handlePinDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleResetAndClose = () => {
    setStep('form');
    setRecipientInput('');
    setAmount('');
    setRemarks('');
    setPin('');
    setErrorMessage('');
    onClose();
  };

  return (
    <>
      {/* TRANSACTION FAILED MODAL (Account Freezed) */}
      <TransactionFailedModal
        isOpen={step === 'failed'}
        onClose={handleResetAndClose}
        onGoHome={handleResetAndClose}
        amount={numAmount}
        recipient={verifiedName || trimmed}
        mode="UPI / Mobile Transfer"
      />

      {/* MAIN MODAL */}
      {step !== 'failed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] relative">
            
            {/* 2-SECOND PROCESSING OVERLAY */}
            {step === 'processing' && (
              <div className="absolute inset-0 z-40 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 relative">
                  <span className="w-16 h-16 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin absolute" />
                  <Smartphone className="w-8 h-8 text-[#FF6B00]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#0A2E65] mb-1">
                  Processing your transaction... Please wait
                </h3>
                <p className="text-xs text-slate-500 font-medium max-w-xs">
                  Routing via UPI NPCI Gateway. Verifying security clearance...
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Transferring ₹{numAmount.toLocaleString('en-IN')}...</span>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#144287] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-orange-400">
                  {step === 'pin' ? <Lock className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {step === 'pin' ? 'Enter 4-Digit UPI PIN' : 'Send to Mobile Number'}
                  </h3>
                  <p className="text-[10px] text-slate-300">
                    {step === 'pin' ? 'Secure UPI PIN' : 'Instant 24x7 UPI Transfer to Any App'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: FORM */}
            {step === 'form' && (
              <form onSubmit={handleProceedToPin} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
                {/* 1. Mobile Number / UPI ID Input */}
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Mobile Number / UPI ID *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={recipientInput}
                      onChange={(e) => {
                        setRecipientInput(e.target.value);
                        setErrorMessage('');
                      }}
                      placeholder="Enter 10-digit mobile or UPI ID"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] font-mono text-sm tracking-wide bg-slate-50/50 focus:bg-white transition-all"
                      autoFocus
                    />
                    {isValidRecipient && (
                      <span className="absolute right-3 top-2.5 text-emerald-600 flex items-center gap-1 text-[11px] font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Valid</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    E.g. 9876543210 or username@okhdfcbank
                  </p>
                </div>

                {/* Real-time Verification Badge */}
                {isValidRecipient && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in duration-150">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-emerald-900 text-xs">{verifiedName}</p>
                        <p className="text-[10px] text-emerald-700 font-mono">
                          Verified NPCI UPI Handle
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold bg-emerald-200/80 text-emerald-800 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                )}

                {/* 2. Amount Input */}
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Enter Amount (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-base font-bold text-slate-400 font-mono">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="any"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setErrorMessage('');
                      }}
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] font-mono font-bold text-lg text-[#0A2E65]"
                    />
                  </div>
                </div>

                {/* Quick Amount Suggestion Chips */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">Quick:</span>
                  {[500, 1000, 2000, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-[#FF6B00] text-slate-600 font-mono text-[11px] font-semibold border border-slate-200 cursor-pointer transition-colors"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>

                {/* 3. Remarks (Optional) */}
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Remarks / Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Lunch split, Groceries"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] text-xs"
                  />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs font-semibold animate-in shake duration-150">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Debiting Account Card */}
                <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                    <span>Debiting: Aarya Bank (XXXX 1234)</span>
                  </div>
                  <span className="font-mono font-bold text-[#0A2E65]">
                    ₹{primaryAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#FF6B00] to-[#E65800] hover:from-[#ff791a] hover:to-[#ff5000] text-white font-extrabold text-sm shadow-md shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] mt-2"
                >
                  <span>Proceed to Pay ₹{parseFloat(amount || '0').toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: UPI PIN KEYPAD */}
            {step === 'pin' && (
              <div className="p-5 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF6B00] mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-black text-base text-[#0A2E65]">
                  Enter 4-Digit UPI PIN
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Authorizing transfer of <span className="font-bold text-slate-900 font-mono">₹{numAmount.toLocaleString('en-IN')}</span> to <span className="font-bold text-slate-900">{verifiedName || trimmed}</span>
                </p>

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

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mb-3">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handlePinInput(digit)}
                      className="h-12 rounded-2xl bg-slate-50 hover:bg-orange-50 active:bg-orange-100 text-slate-800 font-bold text-lg border border-slate-200/80 transition-colors cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="h-12 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePinInput('0')}
                    className="h-12 rounded-2xl bg-slate-50 hover:bg-orange-50 active:bg-orange-100 text-slate-800 font-bold text-lg border border-slate-200/80 transition-colors cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handlePinDelete}
                    className="h-12 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                    title="Delete"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
