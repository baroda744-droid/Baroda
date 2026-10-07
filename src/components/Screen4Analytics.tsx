import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Calculator,
  Percent,
  FileCheck,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  PiggyBank,
  CheckCircle2,
  Calendar,
  X,
  Download,
  Share2,
} from 'lucide-react';
import { SAMPLE_FD, INTEREST_RATE_SLABS } from '../data/mockData';
import { FdCalculatorModal } from './modals/FdCalculatorModal';

interface Screen4Props {
  onBackToHome?: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const Screen4Analytics: React.FC<Screen4Props> = ({
  onBackToHome,
  onToast,
}) => {
  const [fdBalanceHidden, setFdBalanceHidden] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showCloseFdModal, setShowCloseFdModal] = useState(false);

  // New FD / RD opening sheet
  const [openFdModal, setOpenFdModal] = useState<'fd' | 'rd' | null>(null);
  const [newFdPrincipal, setNewFdPrincipal] = useState('50000');
  const [newFdTenure, setNewFdTenure] = useState('24');

  // Active FD state
  const [fdDetails, setFdDetails] = useState(SAMPLE_FD);

  const handleBookNewDeposit = (isRD: boolean) => {
    const amt = parseFloat(newFdPrincipal) || 50000;
    const months = parseInt(newFdTenure) || 24;
    const estMaturity = Math.round(amt * 1.165);

    setFdDetails((prev) => ({
      ...prev,
      principalAmount: prev.principalAmount + amt,
      maturityAmount: prev.maturityAmount + estMaturity,
    }));

    onToast(
      `Successfully opened new ${isRD ? 'Recurring Deposit (RD)' : 'Fixed Deposit (FD)'} of ₹${amt.toLocaleString('en-IN')}!`,
      'success'
    );
    setOpenFdModal(null);
  };

  return (
    <div className="relative pb-24 text-slate-800">
      {/* HEADER: "Save - Book online FD & RD - 360° account overview" with Blue-Orange Gradient */}
      <div className="bg-linear-to-r from-[#0A2E65] via-[#1a4a8c] to-[#FF6B00] text-white p-5 rounded-b-[32px] shadow-md -mx-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-orange-200">
              Wealth & Term Deposits
            </span>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
              360° View
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black leading-snug">
            Save - Book online FD & RD - 360° account overview
          </h1>
          <p className="text-xs text-orange-100/90 mt-1">
            Industry highest interest rates up to 7.85% p.a. with quarterly compounding.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* FD CARD: Dark Blue Gradient #2C4A7A */}
        <div className="rounded-3xl p-5 text-white shadow-xl shadow-blue-950/20 relative overflow-hidden bg-linear-to-br from-[#2C4A7A] to-[#122b54] border border-blue-400/20">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Line: FD Account Number & Eye Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-300">
                FD account number 5413 7700
              </span>
              <span className="text-[9px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-full font-bold">
                Active
              </span>
            </div>
            <button
              onClick={() => setFdBalanceHidden(!fdBalanceHidden)}
              className="text-slate-300 hover:text-white p-1 rounded-full transition-colors"
              title={fdBalanceHidden ? 'Show balance' : 'Hide balance'}
              aria-label="Toggle FD balance"
            >
              {fdBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Balance Amount */}
          <div className="my-3">
            <p className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">
              Current Maturity Value
            </p>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
              {fdBalanceHidden
                ? '₹ •,••,•••'
                : `₹ ${fdDetails.maturityAmount.toLocaleString('en-IN')}`}
            </div>
            <p className="text-[11px] text-orange-300 mt-1 flex items-center gap-1">
              <span>Principal: ₹{fdDetails.principalAmount.toLocaleString('en-IN')}</span>
              <span>•</span>
              <span>Rate: {fdDetails.interestRate}% p.a.</span>
            </p>
          </div>

          {/* Maturity Date info */}
          <div className="text-[11px] text-slate-300 pb-3 border-b border-white/10 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-orange-300" />
              Maturity: {fdDetails.maturityDate}
            </span>
            <span className="text-orange-200 font-semibold">Auto-Renewal: Active</span>
          </div>

          {/* 4 WORKING BUTTONS: Deposit calculator, Interest rate, View receipt, Close FD/RD */}
          <div className="grid grid-cols-4 gap-2 pt-3.5 text-center">
            {/* 1. Deposit calculator */}
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="flex flex-col items-center p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500/30 group-hover:bg-orange-500 text-orange-300 group-hover:text-white flex items-center justify-center mb-1 transition-colors">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold leading-tight">Deposit calculator</span>
            </button>

            {/* 2. Interest rate */}
            <button
              onClick={() => setShowRatesModal(true)}
              className="flex flex-col items-center p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500/30 group-hover:bg-orange-500 text-orange-300 group-hover:text-white flex items-center justify-center mb-1 transition-colors">
                <Percent className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold leading-tight">Interest rate</span>
            </button>

            {/* 3. View receipt */}
            <button
              onClick={() => setShowReceiptModal(true)}
              className="flex flex-col items-center p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500/30 group-hover:bg-orange-500 text-orange-300 group-hover:text-white flex items-center justify-center mb-1 transition-colors">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold leading-tight">View receipt</span>
            </button>

            {/* 4. Close FD/RD */}
            <button
              onClick={() => setShowCloseFdModal(true)}
              className="flex flex-col items-center p-1.5 rounded-xl bg-white/10 hover:bg-red-500/30 active:scale-95 transition-all text-white cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/30 group-hover:bg-red-600 text-red-300 group-hover:text-white flex items-center justify-center mb-1 transition-colors">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold leading-tight">Close FD/RD</span>
            </button>
          </div>
        </div>

        {/* 2 CARDS: FIXED DEPOSIT CARD & RECURRING DEPOSIT CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Fixed Deposit card with Illustration man with growth arrow + "Open now" button */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  High Yield Term Deposit
                </span>
                <h3 className="font-extrabold text-sm text-[#0A2E65] mt-1.5">
                  Fixed Deposit (FD)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Guaranteed returns up to <span className="font-bold text-[#FF6B00]">7.85% p.a.</span>
                </p>
              </div>

              {/* Illustration: Man with growth arrow */}
              <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
                <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
                  <circle cx="40" cy="40" r="36" fill="#FFF6F0" />
                  {/* Growth green arrow in background */}
                  <path
                    d="M20 55L36 38L48 45L62 25"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M52 25H62V35"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Stylized Man figure */}
                  <circle cx="35" cy="30" r="6" fill="#0A2E65" />
                  <path
                    d="M26 58V45C26 41 30 38 35 38C40 38 44 41 44 45V58"
                    fill="#FF6B00"
                  />
                  <path
                    d="M38 42L50 35"
                    stroke="#0A2E65"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setOpenFdModal('fd')}
              className="mt-3.5 w-full py-2.5 px-3 bg-[#FF6B00] hover:bg-[#e65a00] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Recurring deposit card similar */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Monthly Savings Plan
                </span>
                <h3 className="font-extrabold text-sm text-[#0A2E65] mt-1.5">
                  Recurring Deposit (RD)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Save small every month from <span className="font-bold text-[#0A2E65]">₹500/mo</span>
                </p>
              </div>

              {/* Illustration: Piggy bank with growth arrow */}
              <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
                <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
                  <circle cx="40" cy="40" r="36" fill="#EFF6FF" />
                  <circle cx="40" cy="42" r="16" fill="#0A2E65" />
                  <ellipse cx="40" cy="42" rx="14" ry="11" fill="#1D4ED8" />
                  <circle cx="34" cy="38" r="1.5" fill="white" />
                  <rect x="37" y="34" width="6" height="2" rx="1" fill="#FBBF24" />
                  <path
                    d="M24 50L36 36L48 44L60 26"
                    stroke="#FF6B00"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M52 26H60V34"
                    stroke="#FF6B00"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setOpenFdModal('rd')}
              className="mt-3.5 w-full py-2.5 px-3 bg-[#0A2E65] hover:bg-[#071f45] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open RD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PIE CHART SCREEN: "My Account Summary" with pie 34% Expenses, 22% Investment, 44% Incoming with colors */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Monthly Cash Flow Analysis
              </p>
              <h3 className="font-extrabold text-sm sm:text-base text-[#0A2E65]">
                My Account Summary
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              October 2026
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 py-2">
            {/* SVG Pie Chart */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* 
                  Circumference = 2 * PI * r = 2 * 3.14159 * 32 = ~201.06
                  Segments:
                  1. Incoming (44%): 201.06 * 0.44 = 88.47
                  2. Expenses (34%): 201.06 * 0.34 = 68.36
                  3. Investment (22%): 201.06 * 0.22 = 44.23
                */}
                {/* Segment 1: Incoming 44% (Emerald Green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="32"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="18"
                  strokeDasharray="88.47 201.06"
                  strokeDashoffset="0"
                />

                {/* Segment 2: Expenses 34% (Orange #FF6B00) */}
                <circle
                  cx="50"
                  cy="50"
                  r="32"
                  fill="transparent"
                  stroke="#FF6B00"
                  strokeWidth="18"
                  strokeDasharray="68.36 201.06"
                  strokeDashoffset="-88.47"
                />

                {/* Segment 3: Investment 22% (Navy Blue #0A2E65) */}
                <circle
                  cx="50"
                  cy="50"
                  r="32"
                  fill="transparent"
                  stroke="#0A2E65"
                  strokeWidth="18"
                  strokeDasharray="44.23 201.06"
                  strokeDashoffset="-156.83"
                />
              </svg>

              {/* Center donut label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
                <span className="text-sm font-black text-slate-800">100%</span>
                <span className="text-[9px] text-emerald-600 font-bold">Surplus</span>
              </div>
            </div>

            {/* Pie Legend & Category Breakdown */}
            <div className="space-y-2.5">
              {/* 44% Incoming */}
              <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#10B981] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">44% Incoming</p>
                    <p className="text-[10px] text-slate-500">Salary, Dividends & Interest</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#10B981]">₹ 1,02,200</span>
              </div>

              {/* 34% Expenses */}
              <div className="p-2.5 rounded-2xl bg-orange-50/70 border border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#FF6B00] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">34% Expenses</p>
                    <p className="text-[10px] text-slate-500">Bills, Shopping & Fuel</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#FF6B00]">₹ 78,980</span>
              </div>

              {/* 22% Investment */}
              <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#0A2E65] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">22% Investment</p>
                    <p className="text-[10px] text-slate-500">Fixed Deposit & Mutual Funds</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#0A2E65]">₹ 51,100</span>
              </div>
            </div>
          </div>
        </div>

        {/* FINANCIAL HEALTH SCORE 720 GREEN CIRCLE */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Credit & Wealth Index
              </p>
              <h3 className="font-extrabold text-sm sm:text-base text-[#0A2E65]">
                Financial Health Score
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Excellent
            </span>
          </div>

          <div className="flex items-center gap-4 py-1">
            {/* 720 in green circle */}
            <div className="w-20 h-20 rounded-full border-4 border-emerald-500 bg-emerald-50 text-emerald-700 flex flex-col items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <span className="text-2xl font-black leading-none">720</span>
              <span className="text-[9px] font-bold text-emerald-800 uppercase mt-0.5">/ 900</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800">
                You are in the top 8% of creditworthy customers
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Eligible for pre-approved loans up to ₹10,00,000 at special discounted interest rates.
              </p>
              <div className="flex items-center gap-3 pt-1 text-[10px] font-semibold text-slate-600">
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="w-3 h-3" /> On-time EMI: 100%
                </span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="w-3 h-3" /> Credit Utilization: 14%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Deposit Calculator (reusable) */}
      <FdCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onBookDeposit={(p, m, mat) => {
          setFdDetails((prev) => ({
            ...prev,
            principalAmount: prev.principalAmount + p,
            maturityAmount: prev.maturityAmount + mat,
          }));
          onToast(`Booked new Fixed Deposit of ₹${p.toLocaleString('en-IN')}!`, 'success');
        }}
      />

      {/* MODAL 2: Interest Rates Table */}
      {showRatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#1e4a8c] text-white flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">Term Deposit Interest Rates</h3>
                <p className="text-[10px] text-slate-300">Effective from 01 October 2026</p>
              </div>
              <button
                onClick={() => setShowRatesModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200">
                💡 Senior citizens (60+ years) enjoy an additional <span className="font-bold">0.50% p.a.</span> bonus return.
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2.5">Tenure</th>
                      <th className="p-2.5 text-center">General</th>
                      <th className="p-2.5 text-center">Senior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {INTEREST_RATE_SLABS.map((slab, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2.5 font-medium text-slate-800">{slab.tenure}</td>
                        <td className="p-2.5 text-center font-bold text-[#FF6B00]">{slab.general}</td>
                        <td className="p-2.5 text-center font-bold text-[#0A2E65]">{slab.senior}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setShowRatesModal(false)}
                className="w-full py-2.5 bg-[#0A2E65] text-white font-bold rounded-xl text-xs"
              >
                Close Rates Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: View FD Receipt */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-xs">
            <div className="p-4 bg-linear-to-r from-[#FF6B00] to-[#FF4D00] text-white flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">Fixed Deposit Certificate</h3>
                <p className="text-[10px] text-white/80">Certificate No: ARY-FD-882910</p>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {/* Bank header watermark */}
              <div className="text-center pb-2 border-b border-slate-100">
                <span className="font-black text-base text-[#0A2E65]">BANK OF BARODA</span>
                <p className="text-[10px] text-slate-400">Nariman Point Branch, Mumbai 400021</p>
              </div>

              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">FD Account No:</span>
                  <span className="font-bold text-slate-800">{fdDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Depositor Name:</span>
                  <span className="font-bold text-slate-800">Aarya Patel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Principal Deposit:</span>
                  <span className="font-bold text-slate-800">₹ {fdDetails.principalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Interest Rate:</span>
                  <span className="font-bold text-[#FF6B00]">{fdDetails.interestRate}% p.a. (Quarterly)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Date:</span>
                  <span className="text-slate-800">{fdDetails.bookingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Maturity Date:</span>
                  <span className="font-bold text-slate-800">{fdDetails.maturityDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nominee Registered:</span>
                  <span className="text-slate-800">{fdDetails.nominee}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-bold">Maturity Value:</span>
                  <span className="font-black text-[#0A2E65] text-sm">
                    ₹ {fdDetails.maturityAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => alert('Certificate PDF saved to Downloads.')}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => alert('Shareable receipt link copied!')}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Close FD Confirmation */}
      {showCloseFdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-5 text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-red-600 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" />
                Premature Closure of FD
              </h4>
              <button
                onClick={() => setShowCloseFdModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to close FD <span className="font-mono font-bold">5413 7700</span>?
            </p>

            <div className="p-3 bg-red-50 text-red-800 rounded-xl space-y-1">
              <div className="flex justify-between">
                <span>Principal Refund:</span>
                <span className="font-bold">₹ {fdDetails.principalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Accrued Interest:</span>
                <span className="font-bold">+ ₹ 38,420</span>
              </div>
              <div className="flex justify-between">
                <span>Premature Penalty (0.5%):</span>
                <span className="font-bold text-red-600">- ₹ 2,250</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-red-200 font-bold">
                <span>Net Credit to Savings:</span>
                <span>₹ {(fdDetails.principalAmount + 38420 - 2250).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowCloseFdModal(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
              >
                Keep FD Active
              </button>
              <button
                onClick={() => {
                  setShowCloseFdModal(false);
                  onToast('Premature closure request cancelled. Your FD continues earning 7.75%!', 'info');
                }}
                className="py-2.5 rounded-xl bg-red-600 text-white font-bold"
              >
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Open New FD / RD Quick Flow */}
      {openFdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-5 text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#0A2E65]">
                {openFdModal === 'fd' ? 'Open Fixed Deposit (FD)' : 'Open Recurring Deposit (RD)'}
              </h4>
              <button
                onClick={() => setOpenFdModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                {openFdModal === 'fd' ? 'Deposit Principal (₹)' : 'Monthly Deposit Amount (₹)'}
              </label>
              <input
                type="number"
                value={newFdPrincipal}
                onChange={(e) => setNewFdPrincipal(e.target.value)}
                min="1000"
                step="5000"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-[#FF6B00] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Tenure Duration (Months)
              </label>
              <select
                value={newFdTenure}
                onChange={(e) => setNewFdTenure(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-[#FF6B00] focus:outline-hidden"
              >
                <option value="12">12 Months (7.25% p.a.)</option>
                <option value="24">24 Months (7.75% p.a. - Best)</option>
                <option value="36">36 Months (7.75% p.a.)</option>
                <option value="60">60 Months (6.75% p.a. Tax Saver)</option>
              </select>
            </div>

            <div className="p-3 bg-orange-50 rounded-xl text-orange-800">
              <p className="font-bold">Automated Quarterly Compounding</p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Principal will be debited from primary savings account (•••• 3845).
              </p>
            </div>

            <button
              onClick={() => handleBookNewDeposit(openFdModal === 'rd')}
              className="w-full py-3 bg-[#FF6B00] hover:bg-[#e65a00] text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/25 transition-all"
            >
              Book Deposit Instantly
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
