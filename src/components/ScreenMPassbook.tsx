import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Calendar,
  ChevronDown,
  X,
  FileText,
  Share2,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Search,
  Eye,
  EyeOff,
  Filter,
  AlertOctagon,
  AlertTriangle,
} from 'lucide-react';
import { MPassbookTransaction } from '../types';
import { M_PASSBOOK_TRANSACTIONS } from '../data/mockPassbookData';
import { BobSunIcon } from './BobSunIcon';
import { db, getLocalFailedTransactions } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface ScreenMPassbookProps {
  onBack: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  balance?: number;
  accountNumber?: string;
}

export const ScreenMPassbook: React.FC<ScreenMPassbookProps> = ({
  onBack,
  onToast,
  balance = 213560.50,
  accountNumber = 'XXXX XXXX 1234',
}) => {
  const [filter, setFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const [selectedMonth, setSelectedMonth] = useState('Oct 2026');
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  // Search feature in Header
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Transaction for Full Page Detail
  const [selectedTxn, setSelectedTxn] = useState<MPassbookTransaction | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Download PDF Statement Modal
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [statementPeriod, setStatementPeriod] = useState<'1month' | '3months' | 'fy26'>('1month');
  const [statementFormat, setStatementFormat] = useState<'pdf' | 'excel'>('pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  // Dynamic failed transactions loaded permanently from Firestore & localStorage
  const [firestoreTransactions, setFirestoreTransactions] = useState<MPassbookTransaction[]>(() => {
    const local = getLocalFailedTransactions();
    return local.map((doc: any) => ({
      id: doc.id || 'fail-' + Math.random(),
      date: doc.date || 'Today',
      narration: doc.narration || `TRANSFER/FAILED-FRZ to ${doc.toAccount || 'A/C'}`,
      amount: doc.amount || 0,
      type: 'debit' as const,
      balanceAfter: balance,
      utrNo: doc.utrNo || '428' + Math.floor(100000000 + Math.random() * 900000000),
      txnId: 'TXN' + Math.floor(1000000000 + Math.random() * 9000000000),
      ifsc: 'BARB0CHENNA',
      refNo: 'FRZ/' + (doc.toAccount || 'ACCT'),
      remarks: doc.reason || 'Account Freezed - Suspicious Activity',
      mode: (doc.mode || 'UPI') as any,
      status: 'failed' as const,
      reason: doc.reason || 'Account Freezed - Suspicious Activity',
      toAccount: doc.toAccount,
    }));
  });

  useEffect(() => {
    try {
      const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: MPassbookTransaction[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          let formattedDate = 'Today';
          if (data.date) {
            try {
              const dt = data.date.toDate ? data.date.toDate() : new Date(data.date);
              formattedDate = dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            } catch (e) {}
          }
          items.push({
            id: d.id,
            date: formattedDate,
            narration: data.narration || `TRANSFER/FAILED-FRZ to ${data.toAccount || 'A/C'}`,
            amount: data.amount || 0,
            type: 'debit',
            balanceAfter: balance,
            utrNo: data.utrNo || '428' + Math.floor(100000000 + Math.random() * 900000000),
            txnId: 'TXN' + Math.floor(1000000000 + Math.random() * 9000000000),
            ifsc: 'BARB0CHENNA',
            refNo: 'FRZ/' + (data.toAccount || 'ACCT'),
            remarks: data.reason || 'Account Freezed - Suspicious Activity',
            mode: (data.mode || 'UPI') as any,
            status: (data.status || 'failed') as any,
            reason: data.reason || 'Account Freezed - Suspicious Activity',
            toAccount: data.toAccount,
          });
        });
        if (items.length > 0) {
          setFirestoreTransactions(items);
        }
      }, (err) => {
        console.warn('Firestore onSnapshot listener error:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore subscription init error:', e);
    }
  }, [balance]);

  // Combined transactions list: shows ALL transactions including failed ones
  const allTransactions = [...firestoreTransactions, ...M_PASSBOOK_TRANSACTIONS];

  // Filter transactions - shows ALL transactions including failed ones (both success and failed)
  const filteredTransactions = allTransactions.filter((txn) => {
    // Filter by type
    if (filter === 'debit' && txn.type !== 'debit') return false;
    if (filter === 'credit' && txn.type !== 'credit') return false;

    // Filter by month
    if (selectedMonth === 'Oct 2026') {
      if (!txn.date.includes('Oct 2026') && txn.date !== 'Today') return false;
    } else if (selectedMonth === 'Sep 2026') {
      if (!txn.date.includes('Sep 2026')) return false;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesNarration = txn.narration.toLowerCase().includes(q);
      const matchesUtr = txn.utrNo.toLowerCase().includes(q);
      const matchesRef = txn.refNo.toLowerCase().includes(q);
      const matchesAmount = txn.amount.toString().includes(q);
      const matchesReason = txn.reason?.toLowerCase().includes(q);
      if (!matchesNarration && !matchesUtr && !matchesRef && !matchesAmount && !matchesReason) {
        return false;
      }
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

  const handleDownloadStatement = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setIsDownloadModalOpen(false);
      const ext = statementFormat === 'pdf' ? 'pdf' : 'xlsx';
      onToast(
        `Statement downloaded successfully: BOB_Statement_${selectedMonth.replace(' ', '_')}.${ext}`,
        'success'
      );
    }, 1200);
  };

  const formattedBalance = balance.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="relative pb-24 bg-white min-h-screen text-slate-800 animate-in fade-in duration-200 font-sans">
      {/* 1. TOP HEADER: M-Passbook | Savings - XXXX1234 | Search icon + Download */}
      <div className="bg-[#0A2E65] text-white pt-3 pb-3.5 px-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Back Chevron */}
            <button
              onClick={onBack}
              className="p-1 -ml-1 text-white hover:text-orange-300 transition-colors cursor-pointer"
              title="Back to Dashboard"
              aria-label="Back to Dashboard"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Title & Subtitle */}
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight leading-none text-white font-sans">
                M-Passbook
              </h1>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                Savings - {accountNumber.replace(/.*(\d{4})$/, '$1')}
              </p>
            </div>
          </div>

          {/* Right Action Icons: Search & Download PDF Statement */}
          <div className="flex items-center gap-1.5">
            {/* Search Icon */}
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isSearchOpen) setSearchQuery('');
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isSearchOpen ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10'
              }`}
              title="Search Transactions"
              aria-label="Search Transactions"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Download PDF Statement Button */}
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#FF6B00] hover:bg-[#e65c00] text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer"
              title="Download PDF Statement"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Statement</span>
            </button>
          </div>
        </div>

        {/* Inline Search Bar when search is active */}
        {isSearchOpen && (
          <div className="mt-3 relative animate-in fade-in slide-in-from-top-1 duration-150">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search narration, UTR or amount..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white text-slate-800 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. TOP BALANCE CARD (Navy Gradient): Available Balance | ₹ 2,13,560.50 | Eye Icon */}
      <div className="px-4 pt-3.5 pb-2">
        <div className="bg-linear-to-r from-[#0A2E65] via-[#0E3A7E] to-[#15468D] rounded-2xl p-4 text-white shadow-lg shadow-blue-950/20 border border-blue-400/20 relative overflow-hidden">
          {/* Subtle BoB Sun Watermark */}
          <div className="absolute -right-3 -bottom-4 opacity-15 pointer-events-none">
            <BobSunIcon size={95} color="#FF6B00" />
          </div>

          {/* Top line: Available Balance & Eye toggle */}
          <div className="flex items-center justify-between mb-1 relative z-10">
            <span className="text-xs font-medium text-slate-200">
              Available Balance
            </span>
            <button
              onClick={() => {
                setShowBalance(!showBalance);
                onToast(showBalance ? 'Balance hidden' : 'Balance visible', 'info');
              }}
              className="p-1 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={showBalance ? 'Hide balance' : 'Show balance'}
              aria-label="Toggle balance visibility"
            >
              {showBalance ? (
                <Eye className="w-4 h-4 text-orange-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-orange-400" />
              )}
            </button>
          </div>

          {/* Big bold balance: ₹ 2,13,560.50 */}
          <div className="text-2xl sm:text-[28px] font-black tracking-tight text-white font-mono my-1 relative z-10">
            {showBalance ? `₹ ${formattedBalance}` : '₹ ••••••••'}
          </div>

          {/* Bottom line: Account No and CBS Sync */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-200 relative z-10">
            <div className="flex items-center gap-2">
              <span className="font-mono">Account No: {accountNumber}</span>
              <span className="text-slate-400 font-light">•</span>
              <span className="text-[10px] text-orange-200 font-semibold">Savings</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live CBS
            </span>
          </div>
        </div>
      </div>

      {/* 3. FILTER BAR: [All] [Debit] [Credit] <- Pill buttons, Orange for selected | Date: Oct 2026 */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-2 border-b border-slate-100 bg-white sticky top-[57px] z-20">
        {/* Pill buttons: All, Debit, Credit */}
        <div className="flex items-center gap-1.5">
          {(['all', 'debit', 'credit'] as const).map((tab) => {
            const active = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  active
                    ? 'bg-[#FF6B00] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'debit' ? 'Debit' : 'Credit'}
              </button>
            );
          })}
        </div>

        {/* Date Selector: Oct 2026 with calendar icon and chevron */}
        <div className="relative">
          <button
            onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
            title="Select Month Period"
          >
            <Calendar className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>{selectedMonth}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
                  className={`w-full text-left px-3.5 py-2 font-medium hover:bg-orange-50 transition-colors cursor-pointer ${
                    selectedMonth === m
                      ? 'text-[#FF6B00] font-bold bg-orange-50/50'
                      : 'text-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. TRANSACTION LIST - Real Bank Format */}
      <div className="bg-white divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No transactions found for the selected filter or search query.
          </div>
        ) : (
          filteredTransactions.map((txn) => {
            const isDebit = txn.type === 'debit';
            const isFailed = txn.status === 'failed';
            return (
              <div
                key={txn.id}
                onClick={() => setSelectedTxn(txn)}
                className={`py-3.5 px-4 flex items-start gap-3 active:bg-orange-50/30 cursor-pointer transition-colors ${
                  isFailed ? 'bg-red-50/40 hover:bg-red-50/70 border-l-3 border-red-500' : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Left Dot Indicator: Red for Debit / Failed, Green for Credit */}
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    isFailed
                      ? 'bg-red-600 animate-pulse ring-2 ring-red-300'
                      : isDebit
                      ? 'bg-[#EF4444]'
                      : 'bg-[#10B981]'
                  }`}
                />

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Top row: Date on left, Amount on right */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 font-normal">
                      {txn.date}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0 text-right">
                      {isFailed && (
                        <span className="text-[9px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded-xs tracking-wider">
                          FAILED
                        </span>
                      )}
                      <span
                        className={`text-sm sm:text-base font-bold font-mono tracking-tight ${
                          isFailed || isDebit ? 'text-[#DC2626]' : 'text-[#15803D]'
                        }`}
                      >
                        {isDebit ? '₹ -' : '₹ +'}{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Narration in bold font */}
                  <p className="text-sm font-semibold text-slate-900 leading-snug break-words mt-0.5">
                    {txn.narration}
                  </p>

                  {/* Failed Reason in Red if failed */}
                  {isFailed && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-red-600">
                      <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-red-600" />
                      <span>Reason: {txn.reason || 'Account Freezed - Suspicious Activity'}</span>
                    </div>
                  )}

                  {/* Bottom row: Balance on left, optional Charges on right */}
                  <div className="flex items-center justify-between gap-2 mt-1 text-xs text-slate-500">
                    <span className="font-mono">
                      Balance: ₹{txn.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    {isFailed ? (
                      <span className="text-[10px] font-bold text-red-600">
                        Debit Not Allowed
                      </span>
                    ) : txn.charges ? (
                      <span className="text-[11px] text-slate-500">
                        Charges ₹{txn.charges.toFixed(2)}
                      </span>
                    ) : null}
                  </div>
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
            {/* Modal Header */}
            <div className={`p-4 text-white flex items-center justify-between ${
              selectedTxn.status === 'failed'
                ? 'bg-linear-to-r from-red-700 to-rose-800'
                : 'bg-linear-to-r from-[#0A2E65] to-[#144287]'
            }`}>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {selectedTxn.status === 'failed' ? 'Transaction Advice (Failed)' : 'Transaction Details'}
                  </h3>
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

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
              <div className={`text-center py-2.5 rounded-2xl border ${
                selectedTxn.status === 'failed'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-slate-50 border-slate-100'
              }`}>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${
                  selectedTxn.status === 'failed' ? 'text-red-500' : 'text-slate-400'
                }`}>
                  {selectedTxn.status === 'failed'
                    ? 'Debit Not Processed (Failed)'
                    : selectedTxn.type === 'debit'
                    ? 'Amount Debited'
                    : 'Amount Credited'}
                </span>
                <div
                  className={`text-2xl font-black font-mono my-1 ${
                    selectedTxn.status === 'failed' || selectedTxn.type === 'debit'
                      ? 'text-[#DC2626]'
                      : 'text-[#15803D]'
                  }`}
                >
                  {selectedTxn.type === 'debit' ? '-' : '+'} ₹{selectedTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                {selectedTxn.status === 'failed' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-300">
                    <AlertOctagon className="w-3 h-3 text-red-600" />
                    Status: FAILED (Account Freezed)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Status: Completed Successfully
                  </span>
                )}
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
                      className="p-1 text-slate-400 hover:text-[#FF6B00] cursor-pointer"
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
                      className="p-1 text-slate-400 hover:text-[#FF6B00] cursor-pointer"
                      title="Copy UTR"
                    >
                      {copiedField === 'UTR' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* 3. IFSC Code */}
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">IFSC Code:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-slate-800">{selectedTxn.ifsc}</span>
                    <button
                      onClick={() => handleCopy(selectedTxn.ifsc, 'IFSC')}
                      className="p-1 text-slate-400 hover:text-[#FF6B00] cursor-pointer"
                      title="Copy IFSC"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
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
                      `Bank of Baroda Transaction Advice:\nUTR: ${selectedTxn.utrNo}\nAmount: ₹${selectedTxn.amount}\nNarration: ${selectedTxn.narration}\nDate: ${selectedTxn.date}\nRef: ${selectedTxn.refNo}`,
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
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-xs flex flex-col">
            {/* Header */}
            <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#144287] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-orange-400" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">Download Account Statement</h3>
                  <p className="text-[10px] text-slate-300">Savings - {accountNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Account Summary Banner */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Account Balance
                  </span>
                  <span className="text-base font-black font-mono text-[#0A2E65]">
                    ₹ {formattedBalance}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Bank of Baroda</span>
                  <span className="text-[11px] font-bold text-emerald-600">Active</span>
                </div>
              </div>

              {/* Statement Period */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                  Statement Period
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: '1month', label: 'Last 1 Month (Oct 2026)' },
                    { id: '3months', label: 'Last 3 Months (Aug 2026 - Oct 2026)' },
                    { id: 'fy26', label: 'Financial Year 2026-27' },
                  ].map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        statementPeriod === p.id
                          ? 'border-[#FF6B00] bg-orange-50/40 text-slate-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xs">{p.label}</span>
                      <input
                        type="radio"
                        name="statementPeriod"
                        checked={statementPeriod === p.id}
                        onChange={() => setStatementPeriod(p.id as any)}
                        className="text-[#FF6B00] focus:ring-[#FF6B00]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Format selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                  File Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatementFormat('pdf')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      statementFormat === 'pdf'
                        ? 'border-[#FF6B00] bg-[#FF6B00] text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    PDF Statement
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatementFormat('excel')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      statementFormat === 'excel'
                        ? 'border-[#FF6B00] bg-[#FF6B00] text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Excel (.xlsx)
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleDownloadStatement}
                disabled={isDownloading}
                className="w-full py-3 rounded-xl bg-linear-to-r from-[#0A2E65] to-[#144287] hover:from-[#082450] hover:to-[#0f346b] text-white font-bold text-sm shadow-md shadow-blue-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
              >
                {isDownloading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating Statement...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-orange-400" />
                    <span>Download Statement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
