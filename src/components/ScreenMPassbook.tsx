import React, { useState } from 'react';
import {
  ChevronLeft,
  X,
  FileText,
  Share2,
  Download,
  Copy,
  Check,
  Search,
  Eye,
  EyeOff,
  Table as TableIcon,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldAlert,
} from 'lucide-react';
import { MPassbookTransaction } from '../types';
import { M_PASSBOOK_TRANSACTIONS } from '../data/mockPassbookData';
import { BobSunIcon } from './BobSunIcon';

interface ScreenMPassbookProps {
  onBack: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  balance?: number;
  accountNumber?: string;
}

export const ScreenMPassbook: React.FC<ScreenMPassbookProps> = ({
  onBack,
  onToast,
  balance = 575000001402.06,
  accountNumber = '4091 8820 1234',
}) => {
  const [filter, setFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showBalance, setShowBalance] = useState(true);

  // Search feature in Header
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Transaction for Full Page Detail
  const [selectedTxn, setSelectedTxn] = useState<MPassbookTransaction | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Download PDF Statement Modal
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [statementFormat, setStatementFormat] = useState<'pdf' | 'excel'>('pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  // All passbook transactions (ordered from newest to oldest for convenience or standard passbook chronological order)
  const allTransactions = M_PASSBOOK_TRANSACTIONS;

  // Filter transactions
  const filteredTransactions = allTransactions.filter((txn) => {
    if (filter === 'debit' && txn.type !== 'debit') return false;
    if (filter === 'credit' && txn.type !== 'credit') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesNarration = txn.narration.toLowerCase().includes(q);
      const matchesChq = (txn.chqNo || '').toLowerCase().includes(q);
      const matchesDate = txn.date.toLowerCase().includes(q);
      const matchesWithdrawal = (txn.withdrawals || '').toLowerCase().includes(q);
      const matchesDeposit = (txn.deposits || '').toLowerCase().includes(q);
      const matchesBalance = (txn.balanceStr || '').toLowerCase().includes(q);
      if (
        !matchesNarration &&
        !matchesChq &&
        !matchesDate &&
        !matchesWithdrawal &&
        !matchesDeposit &&
        !matchesBalance
      ) {
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
        `Passbook statement downloaded: BOB_Passbook_Statement.${ext}`,
        'success'
      );
    }, 1200);
  };

  return (
    <div className="relative pb-24 bg-slate-50 min-h-screen text-slate-800 animate-in fade-in duration-200 font-sans">
      {/* 1. TOP HEADER */}
      <div className="bg-[#0A2E65] text-white pt-3 pb-3.5 px-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-1 -ml-1 text-white hover:text-orange-300 transition-colors cursor-pointer"
              title="Back to Dashboard"
              aria-label="Back to Dashboard"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight leading-none text-white font-sans">
                mPassbook Statement
              </h1>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                Savings Account - {accountNumber.slice(-4)}
              </p>
            </div>
          </div>

          {/* Right Action Icons: Search & Download Statement */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isSearchOpen) setSearchQuery('');
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isSearchOpen ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10'
              }`}
              title="Search Transactions"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6B00] hover:bg-[#e65c00] text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer"
              title="Download Statement"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Statement</span>
            </button>
          </div>
        </div>

        {/* Inline Search Bar */}
        {isSearchOpen && (
          <div className="mt-3 relative animate-in fade-in slide-in-from-top-1 duration-150">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search date, particulars, chq no, or amount..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white text-slate-800 text-xs font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]"
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

      {/* 2. TOP BALANCE & PASSBOOK INFO CARD */}
      <div className="px-4 pt-3.5 pb-2">
        <div className="bg-linear-to-r from-[#0A2E65] via-[#0E3A7E] to-[#15468D] rounded-2xl p-4 text-white shadow-lg shadow-blue-950/20 border border-blue-400/20 relative overflow-hidden">
          <div className="absolute -right-3 -bottom-4 opacity-15 pointer-events-none">
            <BobSunIcon size={95} color="#FF6B00" />
          </div>

          <div className="flex items-center justify-between mb-1 relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <span>Account Balance (As per Passbook)</span>
              <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                Cr
              </span>
            </div>
            <button
              onClick={() => {
                setShowBalance(!showBalance);
                onToast(showBalance ? 'Balance hidden' : 'Balance visible', 'info');
              }}
              className="p-1 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? (
                <Eye className="w-4 h-4 text-orange-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-orange-400" />
              )}
            </button>
          </div>

          {/* Exact passbook balance: 57500,00,01,402.06Cr */}
          <div className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono my-1 relative z-10 flex items-baseline gap-1">
            <span>₹</span>
            <span>{showBalance ? '57500,00,01,402.06' : '••••••••••••••••'}</span>
            <span className="text-xs text-orange-300 font-bold">Cr</span>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-200 relative z-10">
            <div className="flex items-center gap-2">
              <span className="font-mono">A/C: {accountNumber}</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-orange-200 font-bold">Savings Passbook</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Bank Statement
            </span>
          </div>
        </div>
      </div>

      {/* 3. VIEW TOGGLE & FILTER BAR */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white sticky top-[57px] z-20 shadow-2xs">
        {/* Toggle between Table View & Card View */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-[#0A2E65] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Passbook Table</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-[#0A2E65] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Cards</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1">
          {(['all', 'debit', 'credit'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-[#FF6B00] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'debit' ? 'Withdrawals' : 'Deposits'}
            </button>
          ))}
        </div>
      </div>

      {/* 4. PASSBOOK DETAILS & TRANSACTIONS CONTENT */}
      {viewMode === 'table' ? (
        <div className="p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
            {/* Scrollable Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] font-mono whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b-2 border-slate-400 divide-x divide-slate-300">
                    <th className="py-2.5 px-2.5 w-16 text-center">DATE</th>
                    <th className="py-2.5 px-3 min-w-[220px]">PARTICULARS</th>
                    <th className="py-2.5 px-3 min-w-[190px]">CHQ.NO.</th>
                    <th className="py-2.5 px-3 text-right min-w-[110px]">WITHDRAWALS</th>
                    <th className="py-2.5 px-3 text-right min-w-[130px]">DEPOSITS</th>
                    <th className="py-2.5 px-3 text-right min-w-[140px]">BALANCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {filteredTransactions.map((txn, index) => {
                    const isFreezeRow =
                      txn.narration.includes('FREEZE') ||
                      (txn.remarks && txn.remarks.includes('FREEZE'));

                    return (
                      <tr
                        key={txn.id || index}
                        onClick={() => setSelectedTxn(txn)}
                        className={`hover:bg-orange-50/60 divide-x divide-slate-300 cursor-pointer transition-colors ${
                          index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                        } ${isFreezeRow ? 'bg-amber-50/40' : ''}`}
                      >
                        {/* 1. DATE */}
                        <td className="py-2 px-2.5 text-center font-bold text-slate-900">
                          {txn.date}
                        </td>

                        {/* 2. PARTICULARS */}
                        <td className="py-2 px-3 text-slate-800 max-w-[280px] truncate font-medium">
                          <span
                            title={txn.narration}
                            className={isFreezeRow ? 'font-bold text-[#0A2E65]' : ''}
                          >
                            {txn.narration}
                          </span>
                        </td>

                        {/* 3. CHQ.NO. */}
                        <td className="py-2 px-3 text-slate-700 max-w-[220px] truncate">
                          <span title={txn.chqNo || '-'}>{txn.chqNo || ''}</span>
                        </td>

                        {/* 4. WITHDRAWALS */}
                        <td className="py-2 px-3 text-right font-bold text-rose-700">
                          {txn.withdrawals || ''}
                        </td>

                        {/* 5. DEPOSITS */}
                        <td className="py-2 px-3 text-right font-bold text-emerald-700">
                          {txn.deposits || ''}
                        </td>

                        {/* 6. BALANCE */}
                        <td className="py-2 px-3 text-right font-black text-slate-900">
                          {txn.balanceStr || ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* MOBILE CARDS VIEW */
        <div className="p-3 space-y-2.5">
          {filteredTransactions.map((txn, index) => {
            const isCredit = Boolean(txn.deposits);
            const isDebit = Boolean(txn.withdrawals);
            const isFreeze = txn.narration.includes('FREEZE');

            return (
              <div
                key={txn.id || index}
                onClick={() => setSelectedTxn(txn)}
                className={`p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-orange-300 hover:shadow-xs transition-all cursor-pointer ${
                  isFreeze ? 'border-amber-300 bg-amber-50/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : isDebit
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : isDebit ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block font-mono">
                        {txn.date}
                      </span>
                      <h3 className="font-bold text-xs text-slate-800 line-clamp-1 max-w-[210px]">
                        {txn.narration}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    {isCredit && (
                      <span className="text-xs font-black text-emerald-600 font-mono block">
                        +₹{txn.deposits}
                      </span>
                    )}
                    {isDebit && (
                      <span className="text-xs font-black text-rose-600 font-mono block">
                        -₹{txn.withdrawals}
                      </span>
                    )}
                    {!isCredit && !isDebit && (
                      <span className="text-[10px] text-slate-500 font-mono block">Opening B/F</span>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">
                      Bal: {txn.balanceStr || '-'}
                    </span>
                  </div>
                </div>

                {txn.chqNo && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="truncate max-w-[280px]">Ref/Chq: {txn.chqNo}</span>
                    <span className="text-[#FF6B00] font-bold shrink-0">Details &gt;</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. TRANSACTION DETAILS MODAL */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-xs flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#144287] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <h3 className="font-extrabold text-sm">Passbook Transaction Advice</h3>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
              {/* Top Amount Banner */}
              <div className="text-center py-3 px-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {selectedTxn.deposits
                    ? 'Amount Deposited / Credited'
                    : selectedTxn.withdrawals
                    ? 'Amount Withdrawn / Debited'
                    : 'Opening Ledger Record'}
                </span>
                <div
                  className={`text-xl sm:text-2xl font-black font-mono my-1 ${
                    selectedTxn.deposits
                      ? 'text-emerald-700'
                      : selectedTxn.withdrawals
                      ? 'text-rose-700'
                      : 'text-slate-800'
                  }`}
                >
                  {selectedTxn.deposits
                    ? `+₹ ${selectedTxn.deposits}`
                    : selectedTxn.withdrawals
                    ? `-₹ ${selectedTxn.withdrawals}`
                    : selectedTxn.balanceStr}
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                    Date: {selectedTxn.date}
                  </span>
                  {selectedTxn.balanceStr && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF6B00]">
                      Bal: {selectedTxn.balanceStr}
                    </span>
                  )}
                </div>
              </div>

              {/* Exact Details Fields */}
              <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-[11px]">
                {/* Particulars */}
                <div className="pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium block text-[10px] uppercase">
                    Particulars:
                  </span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5 break-words">
                    {selectedTxn.narration}
                  </p>
                </div>

                {/* Chq. No. / Reference */}
                {selectedTxn.chqNo && (
                  <div className="pb-2 border-b border-slate-200 flex justify-between items-start gap-2">
                    <div>
                      <span className="text-slate-500 font-medium block text-[10px] uppercase">
                        Chq. No. / Ref:
                      </span>
                      <span className="font-mono font-bold text-[#0A2E65] break-all">
                        {selectedTxn.chqNo}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(selectedTxn.chqNo || '', 'Chq/Ref')}
                      className="p-1 text-slate-400 hover:text-[#FF6B00] cursor-pointer"
                      title="Copy"
                    >
                      {copiedField === 'Chq/Ref' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                {/* Withdrawals */}
                {selectedTxn.withdrawals && (
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Withdrawal:</span>
                    <span className="font-mono font-bold text-rose-600">
                      ₹ {selectedTxn.withdrawals}
                    </span>
                  </div>
                )}

                {/* Deposits */}
                {selectedTxn.deposits && (
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Deposit:</span>
                    <span className="font-mono font-bold text-emerald-600">
                      ₹ {selectedTxn.deposits}
                    </span>
                  </div>
                )}

                {/* Balance after entry */}
                {selectedTxn.balanceStr && (
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Running Balance:</span>
                    <span className="font-mono font-black text-slate-900">
                      ₹ {selectedTxn.balanceStr}
                    </span>
                  </div>
                )}

                {/* Security Hold note */}
                {selectedTxn.narration.includes('FREEZE') && (
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[10px] flex items-start gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Notice: SWIFT Inward transaction recorded under security freeze protocol.
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const text = `Bank of Baroda Transaction:\nDate: ${selectedTxn.date}\nParticulars: ${selectedTxn.narration}\nRef: ${selectedTxn.chqNo || '-'}\nBalance: ${selectedTxn.balanceStr || '-'}`;
                    if (navigator?.clipboard?.writeText) {
                      navigator.clipboard.writeText(text);
                    }
                    onToast('Transaction slip details copied!', 'success');
                  }}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Copy Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onToast('Passbook slip advice shared successfully.', 'success');
                    setSelectedTxn(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#0A2E65] hover:bg-[#071f45] text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/20 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Share Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. DOWNLOAD STATEMENT MODAL */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-5 text-xs animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-[#0A2E65]">Download Passbook Statement</h3>
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Format
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['pdf', 'excel'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setStatementFormat(fmt)}
                      className={`p-2.5 rounded-xl border font-bold capitalize transition-all cursor-pointer ${
                        statementFormat === fmt
                          ? 'bg-orange-50 border-[#FF6B00] text-[#FF6B00]'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadStatement}
              disabled={isDownloading}
              className="w-full py-3 rounded-xl bg-[#FF6B00] hover:bg-[#e65c00] text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 active:scale-98 transition-all cursor-pointer"
            >
              {isDownloading ? (
                <span>Generating Statement...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
