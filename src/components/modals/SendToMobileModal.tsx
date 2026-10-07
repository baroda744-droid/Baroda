import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Share2,
  Download,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { BankAccount, Transaction } from '../../types';

interface SendToMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryAccount: BankAccount;
  onSuccess: (tx: Transaction, newBalance: number) => void;
}

export const SendToMobileModal: React.FC<SendToMobileModalProps> = ({
  isOpen,
  onClose,
  primaryAccount,
  onSuccess,
}) => {
  // Blank inputs - no prefilled default payee
  const [recipientInput, setRecipientInput] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptTxn, setReceiptTxn] = useState<Transaction | null>(null);

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

  const handlePay = (e: React.FormEvent) => {
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

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (numAmount > primaryAccount.balance) {
      setErrorMessage(
        `Insufficient balance. Available: ₹${primaryAccount.balance.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
        })}`
      );
      return;
    }

    // Process payment
    setIsProcessing(true);

    setTimeout(() => {
      const refNumber = 'UPI' + Math.floor(1000000000 + Math.random() * 9000000000);
      const newBalance = primaryAccount.balance - numAmount;

      const createdTxn: Transaction = {
        id: 'tx-mobile-' + Date.now(),
        title: `UPI Transfer to ${verifiedName}`,
        recipient: `${verifiedName} (${trimmed})`,
        amount: numAmount,
        type: 'debit',
        category: 'transfer',
        date: 'Today',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        refNumber,
        status: 'Completed',
      };

      setIsProcessing(false);
      setReceiptTxn(createdTxn);
      onSuccess(createdTxn, newBalance);
    }, 700);
  };

  const resetFormAndClose = () => {
    setRecipientInput('');
    setAmount('');
    setRemarks('');
    setErrorMessage('');
    setReceiptTxn(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col text-xs max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#154689] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-400/30">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Send to Mobile Number
              </h3>
              <p className="text-[10px] text-slate-300">bob World Instant 24x7 UPI Transfer</p>
            </div>
          </div>
          <button
            onClick={resetFormAndClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RECEIPT VIEW IF SUCCESSFUL */}
        {receiptTxn ? (
          <div className="p-5 overflow-y-auto space-y-4">
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-slate-800">Payment Successful!</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Money transferred instantly via UPI</p>
              <div className="text-2xl font-black font-mono text-[#0A2E65] my-2">
                ₹{receiptTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Paid To:</span>
                <span className="font-bold text-slate-800">{receiptTxn.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">From Account:</span>
                <span className="font-mono text-slate-800">Aarya Bank (XXXX 1234)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UPI Ref / UTR:</span>
                <span className="font-mono font-bold text-[#0A2E65]">{receiptTxn.refNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="text-slate-700">{receiptTxn.date}, {receiptTxn.time}</span>
              </div>
              {remarks && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Remarks:</span>
                  <span className="font-medium text-slate-700">{remarks}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (navigator?.clipboard?.writeText) {
                    navigator.clipboard.writeText(
                      `Paid ₹${receiptTxn.amount} to ${receiptTxn.recipient}. UTR: ${receiptTxn.refNumber}`
                    );
                  }
                  alert('Payment advice copied to clipboard!');
                }}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Share Receipt</span>
              </button>
              <button
                type="button"
                onClick={resetFormAndClose}
                className="py-2.5 px-3 rounded-xl bg-[#0A2E65] hover:bg-[#071f45] text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/20 cursor-pointer"
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        ) : (
          /* FORM VIEW */
          <form onSubmit={handlePay} className="p-5 overflow-y-auto space-y-3.5">
            {/* From Account Pill */}
            <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Debiting Primary Account
                </span>
                <span className="font-mono font-bold text-xs text-[#0A2E65]">
                  Aarya Bank - {primaryAccount.maskedNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Available</span>
                <span className="font-mono font-bold text-xs text-slate-800">
                  ₹{primaryAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-[11px] animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. BLANK INPUT: Enter Mobile Number / UPI ID */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Mobile Number / UPI ID <span className="text-red-500">*</span>
                </label>
                {isValidRecipient && (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={recipientInput}
                  onChange={(e) => {
                    setRecipientInput(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter 10-digit mobile or UPI ID"
                  autoFocus
                  className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-xs focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-hidden transition-all placeholder:text-slate-400"
                />
                {recipientInput && (
                  <button
                    type="button"
                    onClick={() => setRecipientInput('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Hint: Enter 10-digit mobile (e.g. 9840123456) or UPI ID (e.g. name@okhdfcbank)
              </p>
            </div>

            {/* Payee Preview Pill if valid */}
            {isValidRecipient && (
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-[11px]">Payee: {verifiedName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{trimmed}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  NPCI Verified
                </span>
              </div>
            )}

            {/* 2. Amount Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-sm text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl font-bold font-mono text-sm focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-hidden transition-all placeholder:text-slate-300"
                />
              </div>

              {/* Quick amount chips */}
              <div className="flex items-center gap-1.5 mt-2">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-[#FF6B00] border border-slate-200/80 font-mono font-bold text-[10px] text-slate-600 cursor-pointer transition-colors"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Remarks (Optional) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Remarks / Purpose <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Dinner share, Rent, Groceries"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-xs focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-hidden transition-all placeholder:text-slate-400"
              />
            </div>

            {/* NPCI Security Note */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center gap-2 text-[10px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Real-time IMPS / UPI 2.0 settlement guaranteed by Bank of Baroda.</span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#FF6B00] hover:bg-[#e65c00] active:scale-95 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Verifying & Sending Money...</span>
                  </>
                ) : (
                  <>
                    <span>Send Secure Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
