import React, { useState } from 'react';
import {
  X,
  Building2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Lock,
  Delete,
  ShieldAlert,
} from 'lucide-react';
import { BankAccount, Transaction } from '../../types';
import { TransactionFailedModal } from './TransactionFailedModal';
import { db, auth, recordFailedTransaction } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryAccount: BankAccount;
  onPaymentSuccess?: (transaction: Transaction, newBalance: number) => void;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  isOpen,
  onClose,
  primaryAccount,
}) => {
  const [accountNo, setAccountNo] = useState('');
  const [confirmAccountNo, setConfirmAccountNo] = useState('');
  const [ifsc, setIfsc] = useState('BARB0CHENNA');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [transferType, setTransferType] = useState<'IMPS' | 'NEFT' | 'RTGS' | 'Within Bank'>('IMPS');

  // Steps: 'form' -> 'pin' -> 'processing' -> 'failed'
  const [step, setStep] = useState<'form' | 'pin' | 'processing' | 'failed'>('form');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount || '0');

  const handleProceedToPin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!accountNo || accountNo.length < 8) {
      setError('Please enter a valid Account Number (min 8 digits)');
      return;
    }
    if (accountNo !== confirmAccountNo) {
      setError('Account Numbers do not match! Please verify carefully.');
      return;
    }
    if (!beneficiaryName.trim()) {
      setError('Please enter the Beneficiary Name.');
      return;
    }
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid transfer amount greater than ₹0.');
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
              toAccount: accountNo,
              status: "failed",
              reason: "Account Freezed - Suspicious Activity",
              date: new Date(),
              timestamp: serverTimestamp(),
              narration: `${transferType}/DR/To ${beneficiaryName} (${accountNo.slice(-4)})/FAILED-FRZ`,
              mode: transferType,
            });
          } catch (e) {
            await recordFailedTransaction({
              amount: numAmount,
              toAccount: accountNo,
              reason: "Account Freezed - Suspicious Activity",
              type: "transfer",
              mode: transferType,
              narration: `${transferType}/DR/To ${beneficiaryName} (${accountNo.slice(-4)})/FAILED-FRZ`,
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
    setAccountNo('');
    setConfirmAccountNo('');
    setBeneficiaryName('');
    setAmount('');
    setRemarks('');
    setPin('');
    setError(null);
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
        recipient={beneficiaryName || 'Beneficiary'}
        mode={`${transferType} Transfer`}
      />

      {/* MAIN TRANSFER / PIN / PROCESSING MODAL */}
      {step !== 'failed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col relative">
            
            {/* 2-SECOND PROCESSING OVERLAY */}
            {step === 'processing' && (
              <div className="absolute inset-0 z-40 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 relative">
                  <span className="w-16 h-16 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin absolute" />
                  <Building2 className="w-8 h-8 text-[#FF6B00]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#0A2E65] mb-1">
                  Processing your transaction... Please wait
                </h3>
                <p className="text-xs text-slate-500 font-medium max-w-xs">
                  Connecting to Bank of Baroda CBS. Do not press back or refresh.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Authorizing ₹{numAmount.toLocaleString('en-IN')} via {transferType}...</span>
                </div>
              </div>
            )}

            {/* Modal Top Header */}
            <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#16468c] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-orange-400">
                  {step === 'pin' ? <Lock className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {step === 'pin' ? 'Enter Transaction MPIN' : 'Transfer to Bank Account'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    {step === 'pin' ? 'Security Authorization' : 'IMPS / NEFT / RTGS Express Settlement'}
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
              <form onSubmit={handleProceedToPin} className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
                {/* Transfer Type Pill Selector */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl font-bold text-[11px]">
                  {(['IMPS', 'NEFT', 'RTGS', 'Within Bank'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTransferType(t)}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer truncate ${
                        transferType === t
                          ? 'bg-white text-[#FF6B00] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Account Number */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Beneficiary Account Number *
                  </label>
                  <input
                    type="password"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 8-16 digit account number"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] font-mono text-sm tracking-wider"
                    required
                  />
                </div>

                {/* Confirm Account Number */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Confirm Account Number *
                  </label>
                  <input
                    type="text"
                    value={confirmAccountNo}
                    onChange={(e) => setConfirmAccountNo(e.target.value.replace(/\D/g, ''))}
                    placeholder="Re-enter account number"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] font-mono text-sm tracking-wider"
                    required
                  />
                </div>

                {/* IFSC & Bank details */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                      placeholder="e.g. BARB0CHENNA"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] font-mono font-bold text-xs uppercase"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Branch
                    </label>
                    <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium text-xs truncate">
                      BOB Chennai Main
                    </div>
                  </div>
                </div>

                {/* Beneficiary Name */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Beneficiary Name *
                  </label>
                  <input
                    type="text"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    placeholder="As registered in bank"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] text-xs font-semibold"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Transfer Amount (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-base font-bold text-slate-400 font-mono">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] font-mono font-bold text-base text-[#0A2E65]"
                      required
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Rent, Split bill, Family"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] text-xs"
                  />
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Debit Account Info */}
                <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-200 flex items-center justify-between text-[11px] text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                    <span>Debiting from: Aarya Bank (XXXX 1234)</span>
                  </div>
                  <span className="font-mono font-bold text-[#0A2E65]">
                    ₹{primaryAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#FF6B00] to-[#E65800] hover:from-[#ff791a] hover:to-[#ff5000] text-white font-extrabold text-sm shadow-md shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] mt-2"
                >
                  <span>Proceed to Pay ₹{parseFloat(amount || '0').toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: MPIN SCREEN */}
            {step === 'pin' && (
              <div className="p-5 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF6B00] mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-black text-base text-[#0A2E65]">
                  Enter 4-Digit Transaction MPIN
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Authorizing transfer of <span className="font-bold text-slate-900 font-mono">₹{numAmount.toLocaleString('en-IN')}</span> to <span className="font-bold text-slate-900">{beneficiaryName}</span>
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
