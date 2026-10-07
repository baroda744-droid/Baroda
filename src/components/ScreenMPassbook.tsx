import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Eye,
  EyeOff,
  Calendar,
  Download,
  Share2,
  Copy,
  Check,
  X,
  FileText,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { MPassbookTransaction } from '../types';
import { M_PASSBOOK_TRANSACTIONS } from '../data/mockPassbookData';
import { BobSunIcon } from './BobSunIcon';

interface ScreenMPassbookProps {
  onBack: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ScreenMPassbook: React.FC<ScreenMPassbookProps> = ({ onBack, onToast }) => {
  const [filter, setFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const [showBalance, setShowBalance] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Oct 2026');
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  // Selected Transaction for Full Page Detail
  const [selectedTxn, setSelectedTxn] = useState<MPassbookTransaction | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // PDF Statement Modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Filter transactions
  const filteredTransactions = M_PASSBOOK_TRANSACTIONS.filter((txn) => {
    // Type filter
    if (filter === 'debit' && txn.type !== 'debit') return false;
    if (filter === 'credit' && txn.type !== 'credit') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        txn.narration.toLowerCase().includes(q) ||
        txn.utrNo.toLowerCase().includes(q) ||
        txn.amount.toString().includes(q) ||
        txn.date.toLowerCase().includes(q) ||
        txn.remarks.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Month filter
    if (selectedMonth === 'Oct 2026') {
      return txn.date.includes('Oct 2026');
    } else if (selectedMonth === 'Sep 2026') {
      return txn.date.includes('Sep 2026');
    }

    return true;
  });

  const handleCopy = (text: string, label: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(label);
    onToast(`${label} copied: ${text}`, 'success');
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className="relative pb-24 bg-white min-h-screen text-slate-800 animate-in fade-in duration-200">
      {/* 1. HEADER: M-Passbook | Savings - XXXX1234 | Search icon | Download PDF */}
      <header className="bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-30 shadow-2xs flex items-center justify-between -mx-4 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-[#FF6B00] hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-[#0A2E65] tracking-tight">
                M-Passbook
              </span>
              <span className="text-slate-300 font-light">|</span>
              <span className="text-xs font-semibold text-slate-600 font-mono">
                Savings - XXXX1234
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Bank of Baroda • Chennai Main</p>
          </div>
        </div>

        {/* Right Action Icons: Search + Download PDF Statement */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              searchOpen
                ? 'bg-[#FF6B00] text-white'
                : 'text-slate-600 hover:text-[#FF6B00] hover:bg-orange-50'
            }`}
            title="Search transactions"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#0A2E65] hover:bg-[#071f45] text-white font-bold text-[11px] shadow-xs active:scale-95 transition-all cursor-pointer"
            title="Download PDF Statement"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </header>

      {/* Expandable Search Input Bar */}
      {searchOpen && (
        <div className="mb-3 animate-in slide-in-from-top-2 duration-150">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search narration, UTR, ref no, amount..."
              autoFocus
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. TOP BALANCE CARD (Navy Gradient) */}
      <div className="rounded-3xl p-5 text-white shadow-xl shadow-blue-950/20 bg-linear-to-br from-[#0A2E65] via-[#113a73] to-[#071f45] border border-blue-400/25 relative overflow-hidden mb-4">
        {/* Subtle Bank Watermark */}
        <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
          <BobSunIcon size={96} color="#FFFFFF" />
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-orange-500/10 blur-xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase font-bold tracking-widest text-slate-300">
            Available Balance
          </span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-slate-300 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            title={showBalance ? 'Hide balance' : 'Show balance'}
            aria-label="Toggle balance visibility"
          >
            {showBalance ? <EyeOff className="w-4 h-4 text-orange-300" /> : <Eye className="w-4 h-4 text-orange-300" />}
          </button>
        </div>

        {/* Amount: ₹ 84,562.30 */}
        <div className="my-2.5">
          <div className="text-2xl sm:text-[28px] font-black tracking-tight text-white font-mono">
            {showBalance ? '₹ 84,562.30' : '₹ ••••••••'}
          </div>
          <p className="text-[10px] text-orange-200/90 font-medium mt-0.5">
            Effective Available Balance (No liens or holds)
          </p>
        </div>

        {/* Bottom card row */}
        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
          <span>A/C: 4091 8820 1234</span>
          <span className="text-emerald-300 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live Synced with CBS
          </span>
        </div>
      </div>

      {/* 3. FILTER BAR: [All] [Debit] [Credit] (Pill buttons, Orange for selected) + Date Oct 2026 */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
        {/* Pill buttons: [All] [Debit] [Credit] */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200">
          {(['all', 'debit', 'credit'] as const).map((mode) => {
            const isSelected = filter === mode;
            return (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF6B00] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'all' ? 'All' : mode === 'debit' ? 'Debit' : 'Credit'}
              </button>
            );
          })}
        </div>

        {/* Date: Oct 2026 with calendar icon */}
        <div className="relative">
          <button
            onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-orange-50 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            title="Select period"
          >
            <Calendar className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>{selectedMonth}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Month Dropdown */}
          {isMonthPickerOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1 z-40 text-xs animate-in fade-in duration-150">
              {['Oct 2026', 'Sep 2026', 'All Periods'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMonth(m);
                    setIsMonthPickerOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 font-medium hover:bg-orange-50 transition-colors ${
                    selectedMonth === m ? 'text-[#FF6B00] font-bold bg-orange-50/50' : 'text-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. TRANSACTION LIST - REAL BANK FORMAT (20 TRANSACTIONS) */}
      <div className="space-y-0 divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No transactions found for the selected filter.
          </div>
        ) : (
          filteredTransactions.map((txn) => {
            const isDebit = txn.type === 'debit';
            return (
              <div
                key={txn.id}
                onClick={() => setSelectedTxn(txn)}
                className="py-3 px-1 hover:bg-slate-50 active:bg-orange-50/40 cursor-pointer transition-colors group flex items-start justify-between gap-3"
              >
                {/* Left Side: Date + Narration */}
                <div className="flex-1 min-w-0">
                  {/* Small grey date: e.g. 12 Oct 2026 */}
                  <span className="text-[11px] font-medium text-slate-400 tracking-tight block">
                    {txn.date}
                  </span>

                  {/* Narration: UPI/DR/62848877/bob World/Rahul/SBIN */}
                  <p className="text-xs font-semibold text-slate-800 leading-snug mt-0.5 break-words group-hover:text-[#0A2E65] transition-colors">
                    {txn.narration}
                  </p>

                  {/* Balance in grey: Balance: ₹84,562.30 */}
                  <p className="text-[11px] font-medium text-slate-400 font-mono mt-1">
                    Balance: ₹{showBalance ? txn.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '••••••••'}
                  </p>
                </div>

                {/* Right Side: Amount (Debit in RED, Credit in GREEN) + Charges if any */}
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1 flex-wrap">
                    <span
                      className={`text-xs sm:text-sm font-black font-mono tracking-tight ${
                        isDebit ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {isDebit ? '₹ -' : '₹ +'}{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    {txn.charges && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        | Charges ₹{txn.charges.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <span className="text-[9px] uppercase font-bold text-slate-400 block mt-0.5">
                    {txn.mode}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. FULL PAGE TRANSACTION DETAIL MODAL (ON TAP) */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-xs flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#144287] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">Transaction Details</h3>
                  <p className="text-[10px] text-slate-300">Bank of Baroda e-Advice</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
              {/* Amount badge */}
              <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {selectedTxn.type === 'debit' ? 'Amount Debited' : 'Amount Credited'}
                </span>
                <div
                  className={`text-2xl font-black font-mono my-1 ${
                    selectedTxn.type === 'debit' ? 'text-red-600' : 'text-emerald-600'
                  }`}
                >
                  {selectedTxn.type === 'debit' ? '-' : '+'} ₹{selectedTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Status: Completed Successfully
                </span>
              </div>

              {/* Exact Fields: Transaction ID, UTR No, IFSC, Reference No, Remarks */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-[11px]">
                {/* 1. Transaction ID */}
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Transaction ID:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-slate-800">{selectedTxn.txnId}</span>
                    <button
                      onClick={() => handleCopy(selectedTxn.txnId, 'Txn ID')}
                      className="p-1 text-slate-400 hover:text-[#FF6B00]"
                      title="Copy"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 2. UTR No */}
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">UTR Number:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-black text-[#0A2E65]">{selectedTxn.utrNo}</span>
                    <button
                      onClick={() => handleCopy(selectedTxn.utrNo, 'UTR')}
                      className="p-1 text-slate-400 hover:text-[#FF6B00]"
                      title="Copy UTR"
                    >
                      {copiedField === 'UTR' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* 3. IFSC Code */}
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">IFSC Code:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedTxn.ifsc}</span>
                </div>

                {/* 4. Reference No */}
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Reference No:</span>
                  <span className="font-mono text-slate-800">{selectedTxn.refNo}</span>
                </div>

                {/* 5. Remarks */}
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Remarks:</span>
                  <span className="font-semibold text-slate-800">{selectedTxn.remarks}</span>
                </div>

                {/* Value Date & Post-Txn Balance */}
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Value Date:</span>
                  <span className="text-slate-800">{selectedTxn.date}</span>
                </div>

                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-slate-500 font-medium">Balance After Txn:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{selectedTxn.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleCopy(
                      `BoB World Transaction Advice:\nUTR: ${selectedTxn.utrNo}\nAmount: ₹${selectedTxn.amount}\nNarration: ${selectedTxn.narration}\nDate: ${selectedTxn.date}\nRef: ${selectedTxn.refNo}`,
                      'Full Advice'
                    );
                  }}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Share Advice</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`e-Receipt PDF downloaded for UTR: ${selectedTxn.utrNo}`);
                    onToast('e-Receipt downloaded successfully!', 'success');
                    setSelectedTxn(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#0A2E65] hover:bg-[#071f45] text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/20 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-orange-400" />
                  <span>Download Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. DOWNLOAD PDF STATEMENT MODAL */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-xs">
            <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#144287] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-orange-400" />
                <h3 className="font-extrabold text-sm">Download Account Statement</h3>
              </div>
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-2.5">
                <BobSunIcon size={24} color="#FF6B00" />
                <div>
                  <p className="font-bold text-slate-800">Bank of Baroda • bob World</p>
                  <p className="text-[10px] text-slate-500">Savings A/C: 4091 8820 1234</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Statement Period
                </label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#FF6B00] outline-hidden">
                  <option>Current Month (Oct 2026)</option>
                  <option>Previous Month (Sep 2026)</option>
                  <option>Last 3 Months (Aug - Oct 2026)</option>
                  <option>Financial Year 2026-27</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  File Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border-2 border-[#FF6B00] bg-orange-50/50 text-center font-bold text-[#FF6B00]">
                    PDF Document
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 text-center font-semibold text-slate-600">
                    Excel (XLS)
                  </div>
                </div>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl text-[10px] text-slate-500 border border-slate-200/70">
                🔒 Statement will be digitally signed by Bank of Baroda central repository.
              </div>

              <button
                type="button"
                onClick={() => {
                  alert('Bank of Baroda Account Statement (Oct 2026) PDF generated and saved to your device!');
                  onToast('Statement PDF downloaded successfully!', 'success');
                  setIsPdfModalOpen(false);
                }}
                className="w-full py-3 bg-[#0A2E65] hover:bg-[#071f45] text-white font-bold rounded-xl text-xs shadow-md shadow-blue-950/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" />
                <span>Generate & Download Statement</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
