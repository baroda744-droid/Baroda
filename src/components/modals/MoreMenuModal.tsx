import React from 'react';
import {
  X,
  ShieldCheck,
  Headphones,
  Settings,
  HelpCircle,
  FileText,
  KeyRound,
  CreditCard,
  Building,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { AppScreen } from '../../types';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: AppScreen) => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

interface MenuItem {
  label: string;
  action: () => void;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onToast,
}) => {
  if (!isOpen) return null;

  const moreSections: MenuSection[] = [
    {
      title: 'Quick Banking Services',
      items: [
        { label: 'My Profile & Account Details', action: () => onNavigate('profile'), badge: 'IFSC & MICR' },
        { label: 'M-Passbook (Live Statement)', action: () => onNavigate('mpassbook'), badge: 'e-Passbook' },
        { label: 'Fixed Deposit & 360° Analytics', action: () => onNavigate('analytics'), badge: 'Wealth & Score' },
      ],
    },
    {
      title: 'Customer Service & Safety',
      items: [
        { label: '24x7 National Toll-Free Support (1800 5700)', action: () => onToast('Calling Bank of Baroda 24x7 Helpline...', 'info') },
        { label: 'Cyber Fraud Reporting (1930 / MHA Portal)', action: () => onToast('Connecting with National Cyber Crime Reporting Portal...', 'warning') },
        { label: 'Cheque Book Request & Stop Payment', action: () => onToast('Cheque book request dispatched for registered address.', 'success') },
        { label: 'Find Nearest bob World Branch / ATM', action: () => onToast('Found 14 Bank of Baroda ATMs within 3 km radius.', 'info') },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#1c4786] text-white flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-base">More Services & Navigation</h3>
            <p className="text-[10px] text-slate-300">Quick Access Hub</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {moreSections.map((sec, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-2 px-1">
                {sec.title}
              </h4>
              <div className="space-y-1.5">
                {sec.items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-orange-50 border border-slate-200/70 flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#FF6B00]">
                      {item.label}
                    </span>
                    {item.badge ? (
                      <span className="text-[10px] font-bold bg-[#FF6B00] text-white px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
          bob World • Bank of Baroda official digital banking • RBI Regulated
        </div>
      </div>
    </div>
  );
};
