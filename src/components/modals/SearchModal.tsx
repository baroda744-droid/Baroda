import React, { useState } from 'react';
import { Search, X, ArrowRight, Smartphone, Building2, CreditCard, PiggyBank, Shield, HelpCircle } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionKey: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickFeatures = [
    { title: 'Send to Bank Account', category: 'Transfers', key: 'transfer_bank', icon: Building2 },
    { title: 'Send to Mobile Number / UPI', category: 'Transfers', key: 'transfer_mobile', icon: Smartphone },
    { title: 'Book Fixed Deposit (FD)', category: 'Wealth', key: 'open_fd', icon: PiggyBank },
    { title: 'Term Deposit Calculator', category: 'Wealth', key: 'calculator', icon: PiggyBank },
    { title: 'My Profile / Account Details', category: 'Account', key: 'profile', icon: Building2 },
    { title: 'View Debit Cards & PIN', category: 'Cards', key: 'cards', icon: CreditCard },
    { title: 'Financial Health & 360° View', category: 'Analytics', key: 'analytics', icon: Shield },
    { title: '24x7 Customer Support', category: 'Help', key: 'support', icon: HelpCircle },
  ];

  const filtered = quickFeatures.filter((f) =>
    f.title.toLowerCase().includes(query.toLowerCase()) ||
    f.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 pt-16">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-top-6 duration-200">
        <div className="p-3.5 border-b border-slate-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-[#FF6B00]" />
          <input
            type="text"
            placeholder="Search banking services, cards, loans, FD..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-sm outline-hidden font-medium text-slate-800 placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 max-h-72 overflow-y-auto space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
            Top Banking Services
          </p>
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  onSelectAction(item.key);
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-2xl hover:bg-orange-50 flex items-center justify-between text-xs transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-[#FF6B00]">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{item.category}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#FF6B00] group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
