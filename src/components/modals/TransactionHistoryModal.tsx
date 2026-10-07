import React, { useState } from 'react';
import { X, Search, ArrowUpRight, ArrowDownLeft, FileText, Download, Filter } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  transactions,
}) => {
  const [filter, setFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  if (!isOpen) return null;

  const filtered = transactions.filter((tx) => {
    if (filter === 'debit' && tx.type !== 'debit') return false;
    if (filter === 'credit' && tx.type !== 'credit') return false;
    if (
      searchQuery &&
      !tx.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tx.recipient.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tx.refNumber.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#18488e] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-orange-300 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Passbook & Statements</h3>
              <p className="text-[10px] text-slate-300">Live Transaction History</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-3 bg-slate-50 border-b border-slate-200/80 space-y-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, reference or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              {(['all', 'debit', 'credit'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase transition-colors ${
                    filter === t
                      ? 'bg-[#FF6B00] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => alert('e-Statement for past 6 months emailed to registered email.')}
              className="text-[11px] font-bold text-[#0A2E65] hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              No transactions found matching criteria.
            </div>
          ) : (
            filtered.map((tx) => {
              const isDebit = tx.type === 'debit';
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200/70 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isDebit
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {isDebit ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-[#FF6B00]">
                        {tx.title}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {tx.date} • {tx.time}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono">
                        Ref: {tx.refNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-xs font-black ${
                        isDebit ? 'text-slate-900' : 'text-emerald-600'
                      }`}
                    >
                      {isDebit ? '-' : '+'} ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200 inline-block mt-0.5">
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Transaction Detail Modal */}
        {selectedTx && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h4 className="font-bold text-sm text-[#0A2E65]">Transaction Details</h4>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center py-2">
                <p className="text-[11px] text-slate-400 uppercase font-bold">Total Amount</p>
                <p
                  className={`text-2xl font-black ${
                    selectedTx.type === 'debit' ? 'text-slate-900' : 'text-emerald-600'
                  }`}
                >
                  {selectedTx.type === 'debit' ? '-' : '+'} ₹
                  {selectedTx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Party</span>
                  <span className="font-bold text-slate-800">{selectedTx.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference No</span>
                  <span className="font-mono text-slate-800">{selectedTx.refNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp</span>
                  <span className="text-slate-800">{selectedTx.date}, {selectedTx.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="font-bold text-emerald-600">{selectedTx.status}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTx(null)}
                className="w-full py-2.5 bg-[#0A2E65] text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
