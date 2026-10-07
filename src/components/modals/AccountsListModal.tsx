import React from 'react';
import { X, Wallet, CheckCircle2, ShieldCheck, Copy, ArrowRight, FileText, AlertOctagon, AlertTriangle } from 'lucide-react';
import { BankAccount } from '../../types';

interface AccountsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts?: BankAccount[];
  showBalance: boolean;
  onNavigateToPassbook?: () => void;
}

export const AccountsListModal: React.FC<AccountsListModalProps> = ({
  isOpen,
  onClose,
  accounts,
  showBalance,
  onNavigateToPassbook,
}) => {
  if (!isOpen) return null;

  const primaryAcc = accounts?.[0] || {
    accountNumber: '409188201234',
    maskedNumber: 'XXXX XXXX 1234',
    accountType: 'Savings Account' as const,
    balance: 213560.50,
    bankName: 'Aarya Bank',
    branch: 'Chennai Main Branch',
    ifsc: 'BARB0AARYA01',
    isPrimary: true,
  };

  const formattedBal = primaryAcc.balance.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#16468c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-orange-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                To Self Account
              </h3>
              <p className="text-[10px] text-slate-300">Registered Primary Banking Account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Single Account Card Only */}
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-3">
            {/* Top row: Type + Primary Account Tag only */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Aarya Bank Savings
              </span>
              <span className="text-[10px] font-black bg-[#FF6B00] text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                Primary Account
              </span>
            </div>

            {/* Account identifier and balance */}
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Aarya Bank - {primaryAcc.maskedNumber}
              </p>
              <div className="text-2xl font-black font-mono text-[#0A2E65] mt-1">
                {showBalance ? `₹ ${formattedBal}` : '₹ ••••••••'}
              </div>
            </div>

            {/* Detailed metadata */}
            <div className="pt-3 border-t border-slate-200/70 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400">Account Number:</span>
                <span className="font-mono font-bold text-slate-800">{primaryAcc.maskedNumber}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400">IFSC Code:</span>
                <span className="font-mono font-bold text-[#FF6B00]">{primaryAcc.ifsc}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400">Branch:</span>
                <span className="font-semibold text-slate-800">{primaryAcc.branch}</span>
              </div>
              <div className="flex justify-between items-center pt-1 text-[11px]">
                <span className="text-slate-400">Account Status:</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Active & Operational
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-[11px] text-[#0A2E65] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>This is your single primary linked account for all inward UPI and NEFT transfers.</span>
          </div>

          {/* Action button */}
          <button
            onClick={() => {
              onClose();
              if (onNavigateToPassbook) onNavigateToPassbook();
            }}
            className="w-full py-3 bg-[#0A2E65] hover:bg-[#071f45] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/20 active:scale-95 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-orange-400" />
            <span>View M-Passbook Statement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
