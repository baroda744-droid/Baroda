import React, { useState } from 'react';
import { X, Calculator, TrendingUp, Sparkles, Check, ArrowRight } from 'lucide-react';

interface FdCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookDeposit?: (amount: number, tenureMonths: number, maturity: number) => void;
}

export const FdCalculatorModal: React.FC<FdCalculatorModalProps> = ({
  isOpen,
  onClose,
  onBookDeposit,
}) => {
  const [principal, setPrincipal] = useState<number>(100000);
  const [tenureMonths, setTenureMonths] = useState<number>(24);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);

  if (!isOpen) return null;

  // Rate logic based on tenure
  let baseRate = 7.25;
  if (tenureMonths <= 6) baseRate = 5.75;
  else if (tenureMonths <= 12) baseRate = 6.50;
  else if (tenureMonths <= 24) baseRate = 7.25;
  else if (tenureMonths <= 36) baseRate = 7.75; // BoB World special tenure
  else baseRate = 7.00;

  const effectiveRate = isSeniorCitizen ? baseRate + 0.50 : baseRate;

  // Quarterly compounding formula
  // A = P * (1 + r/400)^(4 * t)
  const years = tenureMonths / 12;
  const maturityAmount = Math.round(
    principal * Math.pow(1 + effectiveRate / 400, 4 * years)
  );
  const interestEarned = maturityAmount - principal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#1a4f96] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-orange-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Term Deposit Calculator</h3>
              <p className="text-[10px] text-slate-300">bob World High-Yield Fixed Deposit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Senior Citizen Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-50 border border-orange-200/70">
            <div>
              <p className="text-xs font-bold text-slate-800">Senior Citizen (60+ yrs)</p>
              <p className="text-[10px] text-slate-500">Get +0.50% p.a. additional interest</p>
            </div>
            <button
              onClick={() => setIsSeniorCitizen(!isSeniorCitizen)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                isSeniorCitizen ? 'bg-[#FF6B00]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isSeniorCitizen ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Principal Amount Input & Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Investment Amount
              </label>
              <span className="font-extrabold text-sm text-[#0A2E65]">
                ₹ {principal.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹10,000</span>
              <span>₹5,00,000</span>
              <span>₹10,00,000</span>
            </div>
          </div>

          {/* Tenure Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Tenure Duration
              </label>
              <span className="font-extrabold text-sm text-[#0A2E65]">
                {tenureMonths} Months ({years} {years === 1 ? 'Year' : 'Years'})
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="60"
              step="6"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>6 Months</span>
              <span>24 Months</span>
              <span>5 Years</span>
            </div>
          </div>

          {/* Rates badge */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Applicable Interest Rate:</span>
            <span className="font-black text-[#FF6B00] text-sm bg-orange-100/80 px-2.5 py-0.5 rounded-full">
              {effectiveRate.toFixed(2)}% p.a.
            </span>
          </div>

          {/* Calculation Result Summary Card */}
          <div className="bg-linear-to-br from-[#0A2E65] to-[#1e4e94] text-white p-4 rounded-2xl shadow-lg space-y-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-xs text-slate-300">Principal Deposit</span>
              <span className="font-bold text-sm">₹ {principal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-xs text-orange-200">Total Interest Earned</span>
              <span className="font-bold text-sm text-orange-300">
                + ₹ {interestEarned.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-300">Maturity Amount</p>
                <p className="text-[10px] text-emerald-300">Compounded Quarterly</p>
              </div>
              <span className="text-xl font-black text-white">
                ₹ {maturityAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => {
              if (onBookDeposit) {
                onBookDeposit(principal, tenureMonths, maturityAmount);
              }
              onClose();
            }}
            className="w-full py-3.5 px-4 bg-[#FF6B00] hover:bg-[#e65a00] active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Book This Fixed Deposit Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
