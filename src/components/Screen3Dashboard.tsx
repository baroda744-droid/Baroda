import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ChevronRight,
  Smartphone,
  Building2,
  Users,
  ReceiptText,
  PiggyBank,
  Calculator,
  FolderKanban,
  BadgePercent,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Coins,
  Compass,
} from 'lucide-react';
import { BankAccount, Transaction, MainTab } from '../types';
import { RECENT_PAYEES } from '../data/mockData';

interface Screen3Props {
  accounts: BankAccount[];
  transactions: Transaction[];
  showBalance: boolean;
  onToggleBalance: () => void;
  onOpenAccountsList: () => void;
  onOpenVoiceModal: () => void;
  onOpenBankTransfer: () => void;
  onOpenSendMobile?: () => void;
  onOpenTxHistory: () => void;
  onOpenFdCalculator: () => void;
  onNavigateToScreen4: () => void;
  onQuickPayMobile: (payeeName: string) => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const Screen3Dashboard: React.FC<Screen3Props> = ({
  accounts,
  transactions,
  showBalance,
  onToggleBalance,
  onOpenAccountsList,
  onOpenVoiceModal,
  onOpenBankTransfer,
  onOpenSendMobile,
  onOpenTxHistory,
  onOpenFdCalculator,
  onNavigateToScreen4,
  onQuickPayMobile,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>('save');

  // Primary single savings account
  const primaryAcc = accounts.find((a) => a.isPrimary) || accounts[0];
  const singleAccountBalance = primaryAcc?.balance !== undefined ? primaryAcc.balance : 213560.50;
  const formattedBalance = singleAccountBalance.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="relative pb-24 text-slate-800">
      {/* Orange Gradient Header Background Behind Upper Section */}
      <div className="bg-linear-to-b from-[#FF6B00] via-[#FF5800] to-[#FFF6F0] pt-3 pb-16 px-4 -mx-4 rounded-b-[32px] shadow-sm">
        {/* Greetings and fast status */}
        <div className="flex items-center justify-between text-white mb-3 px-1">
          <div>
            <p className="text-[11px] font-medium text-orange-100">Namaste & Good Day</p>
            <h2 className="text-base font-extrabold tracking-tight">Aarya Patel</h2>
          </div>
          <span className="text-[10px] font-semibold bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full text-white border border-white/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            Verified Customer
          </span>
        </div>

        {/* SINGLE ACCOUNT CARD - ORIGINAL BOB STYLE */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg shadow-orange-950/10 border border-slate-100 text-slate-800 relative transition-all">
          {/* Top: Savings Account + Eye icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Savings Account
              </span>
              <button
                onClick={onToggleBalance}
                className="text-slate-400 hover:text-[#FF6B00] p-1 rounded-full transition-colors cursor-pointer"
                title={showBalance ? 'Hide balance' : 'Show balance'}
                aria-label="Toggle balance visibility"
              >
                {showBalance ? <EyeOff className="w-4 h-4 text-[#FF6B00]" /> : <Eye className="w-4 h-4 text-[#FF6B00]" />}
              </button>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Primary A/C
            </span>
          </div>

          {/* Middle: Aarya Bank - XXXX 1234 & Balance: ₹2,13,560.50 (big navy bold) */}
          <div className="my-3">
            <span className="text-xs font-bold text-slate-500 block">
              Aarya Bank - XXXX 1234
            </span>
            <div className="text-2xl sm:text-[30px] font-black tracking-tight text-[#0A2E65] font-mono mt-0.5">
              {showBalance ? `Balance: ₹${formattedBalance}` : 'Balance: ₹••••••••'}
            </div>
          </div>

          {/* Bottom: Account No: XXXX XXXX 1234 | IFSC: BARB0AARYA01 */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-600 flex-wrap gap-1">
            <span className="font-mono font-bold text-slate-800">
              Account No: XXXX XXXX 1234
            </span>
            <span className="text-slate-300 font-light hidden sm:inline">|</span>
            <span className="font-mono font-bold text-[#FF6B00]">
              IFSC: BARB0AARYA01
            </span>
          </div>
          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Updated today, 10:52 AM</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live CBS
            </span>
          </div>
        </div>
      </div>

      {/* BODY CONTENT (Shifted slightly upward over gradient) */}
      <div className="-mt-8 space-y-4">
        {/* BANNER: Next-Gen Payments - Experience AI Powered Voice Payments */}
        <button
          onClick={onOpenVoiceModal}
          className="w-full text-left bg-linear-to-r from-[#0A2E65] via-[#154689] to-[#0A2E65] text-white p-3.5 rounded-2xl shadow-lg shadow-blue-950/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-between group border border-blue-400/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-500/20 border border-orange-400/30 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300">
                  Next-Gen Payments
                </span>
                <span className="text-[9px] font-bold bg-[#FF6B00] text-white px-1.5 py-0.2 rounded-full">
                  AI VOICE
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5">
                Experience AI Powered Voice Payments
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-orange-300 group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* 4 TABS: Save (orange active bg white text #FF6B00), Invest, Borrow, Shop */}
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200/80 grid grid-cols-4 gap-1">
          {(['save', 'invest', 'borrow', 'shop'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  onToast(`Switched to ${tab.toUpperCase()} services`, 'info');
                }}
                className={`py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-150 cursor-pointer text-center ${
                  isActive
                    ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* TAB 1: SAVE (Default Primary Banking Experience) */}
        {activeTab === 'save' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* SECTION "SEND MONEY - VIEW MORE >" */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs sm:text-sm font-extrabold text-[#0A2E65] uppercase tracking-wider">
                  Send money
                </h3>
                <button
                  onClick={onOpenTxHistory}
                  className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-0.5"
                >
                  <span>View More</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid 4 icons: To Mobile Number, To Bank Account, To Self Account, Transaction History - ALL CLICKABLE */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {/* 1. To Mobile Number */}
                <button
                  onClick={onOpenSendMobile || (() => onQuickPayMobile(''))}
                  className="group flex flex-col items-center p-2 rounded-2xl hover:bg-orange-50/60 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center shadow-xs group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight mt-2 group-hover:text-[#FF6B00]">
                    To Mobile Number
                  </span>
                </button>

                {/* 2. To Bank Account -> Launches Full Form Modal */}
                <button
                  onClick={onOpenBankTransfer}
                  className="group flex flex-col items-center p-2 rounded-2xl hover:bg-orange-50/60 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center shadow-xs group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight mt-2 group-hover:text-[#FF6B00]">
                    To Bank Account
                  </span>
                </button>

                {/* 3. To Self Account */}
                <button
                  onClick={() => {
                    onToast('Instant transfer between linked Savings and Current accounts', 'info');
                    onOpenAccountsList();
                  }}
                  className="group flex flex-col items-center p-2 rounded-2xl hover:bg-orange-50/60 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center shadow-xs group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight mt-2 group-hover:text-[#FF6B00]">
                    To Self Account
                  </span>
                </button>

                {/* 4. Transaction History */}
                <button
                  onClick={onOpenTxHistory}
                  className="group flex flex-col items-center p-2 rounded-2xl hover:bg-orange-50/60 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center shadow-xs group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                    <ReceiptText className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight mt-2 group-hover:text-[#FF6B00]">
                    Transaction History
                  </span>
                </button>
              </div>

              {/* Quick Payee shortcuts row */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Recent Payees
                </p>
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                  {RECENT_PAYEES.map((payee, idx) => (
                    <button
                      key={idx}
                      onClick={() => onQuickPayMobile(payee.name)}
                      className="flex flex-col items-center shrink-0 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#FF6B00] group-hover:text-white text-slate-700 font-black text-xs flex items-center justify-center transition-all border border-slate-200">
                        {payee.avatar}
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 mt-1 max-w-[60px] truncate">
                        {payee.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION "DEPOSIT" */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs sm:text-sm font-extrabold text-[#0A2E65] uppercase tracking-wider">
                  Deposit
                </h3>
                <button
                  onClick={onNavigateToScreen4}
                  className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-0.5"
                >
                  <span>Overview</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid 4: Open Deposit, Term Deposit Calculator, Manage Deposits, Loan/OD Against Deposit */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {/* 1. Open Deposit */}
                <button
                  onClick={onNavigateToScreen4}
                  className="group flex flex-col items-center p-2 rounded-2xl hover:bg-blue-50/60 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0A2E65] flex items-center justify-center shadow-xs group-hover:bg-[#0A2E65] group-hover:text-white transition-all">
                    <PiggyBank className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight mt-2 group-hover:text-[#0A2E65]">
                    Open Deposit
                  </span>
                </button>

                {/* 2. Term Deposit Calculator */}
                <button
                  onClick={onOpenFdCalculator}
                  className="group flex flex-col items-center p-2 rounded-2xl hover:bg-blue-50/60 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0A2E65] flex items-center justify-center shadow-xs group-hover:bg-[#0A2E65] group-hover:text-white transition-all">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight mt-2 group-hover:text-[#0A2E65]">
                    Term Deposit Calculator
                  </span>
                </button>

                {/* 3. Manage Deposits */}
                <button
                  onClick={onNavigateToScreen4}
                  className="group flex flex-col items-center p-2 rounded-2xl hover:bg-blue-50/60 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0A2E65] flex items-center justify-center shadow-xs group-hover:bg-[#0A2E65] group-hover:text-white transition-all">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight mt-2 group-hover:text-[#0A2E65]">
                    Manage Deposits
                  </span>
                </button>

                {/* 4. Loan/OD Against Deposit */}
                <button
                  onClick={() => {
                    onToast('Pre-approved Overdraft of ₹4,05,000 available against your active FD!', 'success');
                  }}
                  className="group flex flex-col items-center p-2 rounded-2xl hover:bg-blue-50/60 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0A2E65] flex items-center justify-center shadow-xs group-hover:bg-[#0A2E65] group-hover:text-white transition-all">
                    <BadgePercent className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight mt-2 group-hover:text-[#0A2E65]">
                    Loan/OD Against Deposit
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Bill Pay & Recharge Services Card */}
            <div className="bg-linear-to-r from-orange-500/10 via-amber-500/5 to-white rounded-3xl p-4 border border-orange-200/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Recharge & Bill Pay
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Zero Surcharge
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { label: 'Electricity', icon: '⚡' },
                  { label: 'Mobile Postpaid', icon: '📱' },
                  { label: 'FASTag', icon: '🚗' },
                  { label: 'Broadband', icon: '🌐' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onToast(`Selected ${item.label} biller`, 'info')}
                    className="p-2.5 rounded-2xl bg-white hover:bg-orange-50 border border-slate-100 shadow-2xs text-center transition-colors cursor-pointer"
                  >
                    <span className="text-xl block mb-1">{item.icon}</span>
                    <span className="text-[10px] font-bold text-slate-700 block truncate">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVEST */}
        {activeTab === 'invest' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-[#0A2E65]">Wealth & Investments</h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Portfolio: +14.2% YTD
                </span>
              </div>

              {[
                { title: 'Mutual Funds (SIP & Lumpsum)', desc: 'Zero commission direct mutual funds & tax-saving ELSS', returnVal: 'Top rated 5★ funds' },
                { title: 'Sovereign Gold Bonds (SGB)', desc: '2.5% annual interest + capital gains tax exemption', returnVal: 'RBI Tranche open' },
                { title: 'National Pension Scheme (NPS)', desc: 'Additional ₹50,000 tax deduction under 80CCD(1B)', returnVal: 'Retirement corpus' },
                { title: 'bob 3-in-1 Demat Account', desc: 'Seamless trading linked directly with savings account', returnVal: '₹0 A/C opening' },
              ].map((inv, idx) => (
                <div
                  key={idx}
                  onClick={() => onToast(`Exploring ${inv.title}`, 'info')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/50 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{inv.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{inv.desc}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#FF6B00] bg-orange-100 px-2 py-1 rounded-lg shrink-0 ml-2">
                    {inv.returnVal}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BORROW */}
        {activeTab === 'borrow' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-[#0A2E65]">Instant Pre-Approved Loans</h3>
                <span className="text-[10px] font-bold bg-blue-100 text-[#0A2E65] px-2 py-0.5 rounded-full">
                  CIBIL 720+
                </span>
              </div>

              {[
                { title: 'Pre-Approved Personal Loan', limit: '₹ 5,00,000', rate: '10.25% p.a.', desc: 'Disbursal in 60 seconds with zero paperwork' },
                { title: 'Home Loan / Balance Transfer', limit: 'Up to ₹ 5 Cr', rate: '8.40% p.a.', desc: 'Concession for women borrowers' },
                { title: 'Pre-Approved Two-Wheeler / Car Loan', limit: '100% on-road', rate: '8.75% p.a.', desc: 'Drive your dream vehicle instantly' },
                { title: 'Gold Loan at Doorstep', limit: 'Up to 90% LTV', rate: '9.00% p.a.', desc: 'Instant valuation and safety vault storage' },
              ].map((loan, idx) => (
                <div
                  key={idx}
                  onClick={() => onToast(`Checking eligibility for ${loan.title}: Instant approval available!`, 'success')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/50 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{loan.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{loan.desc}</p>
                    <span className="text-[10px] font-extrabold text-[#0A2E65] mt-1 inline-block">
                      Limit: {loan.limit} • Interest: {loan.rate}
                    </span>
                  </div>
                  <button className="px-2.5 py-1.5 rounded-xl bg-[#0A2E65] text-white text-[10px] font-bold shrink-0 ml-2">
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SHOP */}
        {activeTab === 'shop' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-[#0A2E65]">bob World Deals & Rewards</h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  2,450 Reward Points
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-linear-to-r from-amber-500/20 to-orange-500/10 border border-amber-200 text-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold">bob World Debit Card Cashback</p>
                  <p className="text-[11px] text-slate-600">Get flat 5% cashback on Swiggy, Zomato & BookMyShow</p>
                </div>
                <button
                  onClick={() => onToast('Offer activated on your Rupay Platinum card!', 'success')}
                  className="px-3 py-1 bg-[#FF6B00] text-white text-[10px] font-bold rounded-lg"
                >
                  Activate
                </button>
              </div>

              {[
                { merchant: 'MakeMyTrip Flights', offer: 'Flat ₹1,500 off on domestic flights' },
                { merchant: 'Amazon Great Indian Festival', offer: 'Instant 10% discount up to ₹1,750' },
                { merchant: 'Croma & Reliance Digital', offer: 'Up to ₹5,000 instant cashback on electronics' },
              ].map((deal, idx) => (
                <div
                  key={idx}
                  onClick={() => onToast(`Copied voucher for ${deal.merchant}!`, 'success')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-orange-50 border border-slate-100 flex items-center justify-between text-xs cursor-pointer"
                >
                  <div>
                    <h4 className="font-bold text-slate-800">{deal.merchant}</h4>
                    <p className="text-[11px] text-slate-500">{deal.offer}</p>
                  </div>
                  <span className="text-[#FF6B00] font-bold text-[10px]">Claim &gt;</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
