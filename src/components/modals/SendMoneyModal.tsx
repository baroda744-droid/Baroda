import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Share2,
  Download,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { BankAccount, Transaction } from '../../types';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryAccount: BankAccount;
  onPaymentSuccess: (transaction: Transaction, newBalance: number) => void;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  isOpen,
  onClose,
  primaryAccount,
  onPaymentSuccess,
}) => {
  const [accountNo, setAccountNo] = useState('');
  const [confirmAccountNo, setConfirmAccountNo] = useState('');
  const [ifsc, setIfsc] = useState('ARYA0001089');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');

  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [lastTx, setLastTx] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(amount);
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
    if (numAmount > primaryAccount.balance) {
      setError(`Insufficient balance. Current balance: ₹${primaryAccount.balance.toLocaleString('en-IN')}`);
      return;
    }

    // Step 2: Processing state
    setStep('processing');

    setTimeout(() => {
      const generatedRef = 'ARYA' + Math.floor(1000000000 + Math.random() * 9000000000);
      const newTx: Transaction = {
        id: 'tx-' + Date.now(),
        title: `Transfer to ${beneficiaryName}`,
        recipient: `${beneficiaryName} (A/C: •••• ${accountNo.slice(-4)})`,
        accountNo: accountNo,
        amount: numAmount,
        type: 'debit',
        category: 'transfer',
        date: 'Today',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        refNumber: generatedRef,
        status: 'Completed',
      };

      const newBal = primaryAccount.balance - numAmount;
      setLastTx(newTx);
      onPaymentSuccess(newTx, newBal);
      setStep('success');
    }, 1500);
  };

  const handleResetAndClose = () => {
    setStep('form');
    setAccountNo('');
    setConfirmAccountNo('');
    setBeneficiaryName('');
    setAmount('');
    setRemarks('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#16468c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-orange-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {step === 'success' ? 'Payment Successful' : 'Transfer to Bank Account'}
              </h3>
              <p className="text-[11px] text-slate-300">
                IMPS / NEFT / RTGS Express Settlement
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-orange-200 border-t-[#FF6B00] animate-spin" />
                <div className="absolute inset-3 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6B00] font-black text-xs">
                  ₹
                </div>
              </div>
              <h4 className="text-base font-bold text-slate-800">Processing Payment...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Connecting with RBI National Financial Switch & verifying 2FA MPIN...
              </p>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handlePayNow} className="space-y-3.5">
              {/* Debiting from Account selector banner */}
              <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">From Account</p>
                  <p className="font-bold text-slate-800">{primaryAccount.accountType}</p>
                  <p className="text-[11px] text-slate-500">{primaryAccount.maskedNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">Available Balance</p>
                  <p className="font-black text-[#0A2E65] text-sm">
                    ₹{primaryAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* To Account No */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  To Account Number *
                </label>
                <input
                  type="text"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 9-18 digit account number"
                  maxLength={18}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00] font-mono tracking-wider"
                  required
                />
              </div>

              {/* Confirm Acc No */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Confirm Account Number *
                </label>
                <input
                  type="password"
                  value={confirmAccountNo}
                  onChange={(e) => setConfirmAccountNo(e.target.value.replace(/\D/g, ''))}
                  placeholder="Re-enter account number"
                  maxLength={18}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00] font-mono tracking-wider"
                  required
                />
                {accountNo && confirmAccountNo && (
                  <p className={`text-[10px] mt-1 font-medium ${accountNo === confirmAccountNo ? 'text-emerald-600' : 'text-red-500'}`}>
                    {accountNo === confirmAccountNo ? '✓ Account numbers match' : '✗ Account numbers do not match'}
                  </p>
                )}
              </div>

              {/* IFSC & Quick autofills */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    IFSC Code *
                  </label>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    ✓ Verified: Mumbai Nariman Point
                  </span>
                </div>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. ARYA0001089"
                  maxLength={11}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00] font-mono uppercase"
                  required
                />
              </div>

              {/* Beneficiary Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Beneficiary Name *
                </label>
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="Enter name as per bank records"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="1"
                    max="500000"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-base font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]"
                    required
                  />
                </div>
                {/* Fast chip amounts */}
                <div className="flex items-center gap-1.5 mt-2">
                  {[500, 1000, 2500, 5000, 10000].map((quickAmt) => (
                    <button
                      key={quickAmt}
                      type="button"
                      onClick={() => setAmount(quickAmt.toString())}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-100 hover:text-[#FF6B00] text-slate-600 transition-colors"
                    >
                      +₹{quickAmt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Remarks / Note
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Rent, Freelance, Gift"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>

              {/* Security confirmation notice */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Protected by bob World Shield 2-Factor Authentication</span>
              </div>

              {/* Pay Now Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#0A2E65] hover:bg-[#071f45] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-md shadow-blue-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                <span>Pay Now</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </button>
            </form>
          )}

          {step === 'success' && lastTx && (
            <div className="py-2 text-center animate-in zoom-in-95 duration-200">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md shadow-emerald-500/20 mb-3">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <h4 className="text-xl font-black text-slate-900">Payment Successful!</h4>
              <p className="text-2xl font-black text-[#0A2E65] my-2">
                ₹{lastTx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>

              {/* Receipt Details Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2.5 my-4 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Transaction Ref No</span>
                  <span className="font-mono font-bold text-slate-800">{lastTx.refNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Sent To</span>
                  <span className="font-bold text-slate-800">{lastTx.recipient}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">IFSC Code</span>
                  <span className="font-mono text-slate-800">{ifsc}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Debited From</span>
                  <span className="font-bold text-slate-800">{primaryAccount.accountType} ({primaryAccount.maskedNumber})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Date & Time</span>
                  <span className="text-slate-800">{lastTx.date}, {lastTx.time}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Remaining Balance</span>
                  <span className="font-bold text-emerald-700">
                    ₹{(primaryAccount.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => alert(`Receipt downloaded for Ref: ${lastTx.refNumber}`)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Share link copied: Bank of Baroda (bob World) Ref ${lastTx.refNumber}`)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Receipt</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3 px-4 rounded-xl bg-[#0A2E65] text-white font-bold text-xs shadow-md transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
