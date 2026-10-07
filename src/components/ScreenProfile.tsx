import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Copy,
  Check,
  Share2,
  Download,
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  X,
  FileText,
} from 'lucide-react';
import { UserProfileData } from '../types';
import { BobSunIcon } from './BobSunIcon';

interface ScreenProfileProps {
  onBack: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

const DEFAULT_PROFILE: UserProfileData = {
  name: 'Aarya',
  accountNumber: '4091 8820 1234',
  maskedAccountNumber: 'XXXX XXXX 1234',
  accountType: 'Savings',
  ifsc: 'BARB0CHENNA',
  micr: '600012045',
  branch: 'BOB Bank - Chennai Main',
  customerId: 'AAR12345678',
  mobile: '+91 98401 23456',
  email: 'aarya@email.com',
  pan: 'XXXXX1234X',
  address: 'Chennai, TN',
};

export const ScreenProfile: React.FC<ScreenProfileProps> = ({ onBack, onToast }) => {
  // Load profile from localStorage
  const [profile, setProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem('bob_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_PROFILE;
  });

  // Hide/Show Account Number Toggle
  const [showFullAccount, setShowFullAccount] = useState(false);

  // Copy feedback states
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Share statement preview modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bob_user_profile', JSON.stringify(profile));
    } catch (e) {
      // ignore
    }
  }, [profile]);

  // Handle Clipboard Copy
  const handleCopy = (text: string, label: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(label);
    onToast(`${label} copied to clipboard: ${text}`, 'success');
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className="relative pb-24 text-slate-800 animate-in fade-in duration-200">
      {/* TOP HEADER: Back button + Title + Share action */}
      <div className="bg-white px-4 py-3.5 border-b border-orange-100 flex items-center justify-between sticky top-0 z-30 shadow-xs -mx-4 mb-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:text-[#FF6B00] hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
            aria-label="Back to Dashboard"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-[#0A2E65] leading-tight">
              My Profile / Account Details
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">
              Bank of Baroda • Verified KYC Customer
            </p>
          </div>
        </div>

        {/* Share Button (Top Right) */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6B00] font-bold text-xs border border-orange-200/80 active:scale-95 transition-all cursor-pointer shadow-2xs"
          title="Share account details PDF"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share PDF</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* TOP SECTION: BOB CARD STYLE */}
        <div className="relative rounded-3xl p-5 text-white shadow-2xl shadow-blue-950/25 overflow-hidden bg-linear-to-br from-[#0A2E65] via-[#103b78] to-[#071f45] border border-blue-400/30">
          {/* Subtle Background Radial Watermark */}
          <div className="absolute -right-6 -bottom-6 w-44 h-44 rounded-full bg-orange-500/10 blur-xl pointer-events-none" />
          <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
            <BobSunIcon size={120} color="#FFFFFF" />
          </div>

          {/* Top Bar of Card: Big B Logo in Circle + Card Type */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Big B Logo in circle */}
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg shadow-orange-500/20 p-2.5 ring-3 ring-orange-400/60 shrink-0">
                <BobSunIcon size={34} color="#FF6B00" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-orange-300 block">
                  Primary Account Holder
                </span>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {profile.name}
                </h2>
              </div>
            </div>

            {/* A/C Type Badge */}
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-orange-500 text-white shadow-md shadow-orange-500/30 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" />
                {profile.accountType} A/C
              </span>
            </div>
          </div>

          {/* Chip & Contactless Icons */}
          <div className="flex items-center gap-3 my-2.5">
            <div className="w-10 h-7 rounded-lg bg-amber-300/90 border border-amber-400 flex items-center justify-center shadow-xs">
              <div className="w-6 h-4 border border-amber-600/40 rounded-xs" />
            </div>
            <span className="text-xs font-mono tracking-widest opacity-75">)))</span>
            <span className="text-[10px] font-semibold text-slate-300 ml-auto">
              Bank of Baroda • bob World
            </span>
          </div>

          {/* Account Number with Eye Icon show/hide */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                Account Number
              </p>
              <p className="font-mono text-lg sm:text-xl font-black tracking-widest text-white mt-0.5">
                {showFullAccount ? profile.accountNumber : profile.maskedAccountNumber}
              </p>
            </div>

            {/* Eye toggle button */}
            <button
              onClick={() => {
                const nextState = !showFullAccount;
                setShowFullAccount(nextState);
                onToast(nextState ? 'Full account number revealed' : 'Account number masked', 'info');
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title={showFullAccount ? 'Hide account number' : 'Show account number'}
            >
              {showFullAccount ? <EyeOff className="w-4 h-4 text-orange-300" /> : <Eye className="w-4 h-4 text-orange-300" />}
              <span className="text-[11px]">{showFullAccount ? 'Hide' : 'Show'}</span>
            </button>
          </div>
        </div>

        {/* MIDDLE SECTION: BANK DETAILS CARD */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0A2E65] flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#0A2E65]">
                  Bank Details
                </h3>
                <p className="text-[10px] text-slate-400">Branch & Clearing Codes</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Active Branch
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* 1. IFSC Code [Copy icon] */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-orange-50/40 transition-colors">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  1. IFSC Code
                </span>
                <span className="font-mono font-black text-sm text-[#0A2E65]">
                  {profile.ifsc}
                </span>
              </div>
              <button
                onClick={() => handleCopy(profile.ifsc, 'IFSC Code')}
                className="p-2 rounded-xl bg-white hover:bg-orange-100 text-slate-700 hover:text-[#FF6B00] border border-slate-200 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs font-bold text-[11px]"
                title="Copy IFSC Code"
              >
                {copiedField === 'IFSC Code' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. MICR Code [Copy icon] */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-orange-50/40 transition-colors">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  2. MICR Code
                </span>
                <span className="font-mono font-black text-sm text-[#0A2E65]">
                  {profile.micr}
                </span>
              </div>
              <button
                onClick={() => handleCopy(profile.micr, 'MICR Code')}
                className="p-2 rounded-xl bg-white hover:bg-orange-100 text-slate-700 hover:text-[#FF6B00] border border-slate-200 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs font-bold text-[11px]"
                title="Copy MICR Code"
              >
                {copiedField === 'MICR Code' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* 3. Branch */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  3. Branch
                </span>
                <span className="font-extrabold text-xs text-slate-800">
                  {profile.branch}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold bg-white px-2 py-1 rounded-lg border border-slate-200">
                Sol ID: 0451
              </span>
            </div>

            {/* 4. Customer ID */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  4. Customer ID
                </span>
                <span className="font-mono font-black text-sm text-[#0A2E65]">
                  {profile.customerId}
                </span>
              </div>
              <button
                onClick={() => handleCopy(profile.customerId, 'Customer ID')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF6B00] hover:bg-orange-50 transition-colors"
                title="Copy Customer ID"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: PERSONAL DETAILS CARD */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#0A2E65]">
                  Personal Details
                </h3>
                <p className="text-[10px] text-slate-400">Registered Communication & Tax Info</p>
              </div>
            </div>

            {/* Verified & Locked Badge */}
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified & Locked
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* 1. Mobile No (Non-editable Bank Verified) */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-600 border border-slate-200 shadow-2xs">
                  <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    1. Mobile No
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-800">
                    {profile.mobile}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            </div>

            {/* 2. Email ID (Non-editable Bank Verified) */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-600 border border-slate-200 shadow-2xs">
                  <Mail className="w-3.5 h-3.5 text-[#FF6B00]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    2. Email ID
                  </span>
                  <span className="font-semibold text-xs text-slate-800">
                    {profile.email}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            </div>

            {/* 3. PAN */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-600 border border-slate-200 shadow-2xs">
                  <CreditCard className="w-3.5 h-3.5 text-[#0A2E65]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    3. Permanent Account Number (PAN)
                  </span>
                  <span className="font-mono font-black text-xs text-[#0A2E65]">
                    {profile.pan}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified
              </span>
            </div>

            {/* 4. Address */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-600 border border-slate-200 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    4. Communication Address
                  </span>
                  <span className="font-semibold text-xs text-slate-800">
                    {profile.address}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">India</span>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS: Share PDF + Back to Dashboard */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Share as PDF Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-orange-50 text-[#0A2E65] hover:text-[#FF6B00] border-2 border-[#0A2E65]/20 font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#FF6B00]" />
            <span>Share PDF Details</span>
          </button>

          {/* Back to Dashboard Button */}
          <button
            onClick={onBack}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#0A2E65] hover:bg-[#071f45] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-950/20 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* MODAL 2: SHARE DETAILS AS PDF CARD MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-xs flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#144287] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <h3 className="font-extrabold text-sm">Account Details PDF Slip</h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Passbook Slip Card */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
              <div className="border-2 border-dashed border-orange-200 rounded-2xl p-4 bg-orange-50/40 space-y-2.5">
                {/* Bank Brand Header */}
                <div className="flex items-center justify-between pb-2 border-b border-orange-200/80">
                  <div className="flex items-center gap-2">
                    <BobSunIcon size={24} color="#FF6B00" />
                    <div>
                      <p className="font-black text-sm text-[#0A2E65] leading-tight">
                        BANK OF BARODA
                      </p>
                      <p className="text-[9px] text-slate-400">bob World e-Passbook Slip</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold bg-white text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    Official Slip
                  </span>
                </div>

                {/* Formatted Account Details List */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Name:</span>
                    <span className="font-bold text-slate-800">{profile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Number:</span>
                    <span className="font-mono font-bold text-slate-800">{profile.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Type:</span>
                    <span className="font-bold text-slate-800">{profile.accountType} Account</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">IFSC Code:</span>
                    <span className="font-mono font-bold text-[#FF6B00]">{profile.ifsc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">MICR Code:</span>
                    <span className="font-mono font-bold text-slate-800">{profile.micr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Branch:</span>
                    <span className="font-bold text-slate-800">{profile.branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer ID:</span>
                    <span className="font-mono text-slate-800">{profile.customerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mobile:</span>
                    <span className="font-mono text-slate-800">{profile.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-800">{profile.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-orange-200/80 text-[9px] text-center text-slate-400">
                  Generated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} via bob World Mobile App
                </div>
              </div>

              {/* Share / Copy Full text action buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const fullText = `Bank of Baroda Account Details:\nName: ${profile.name}\nA/C No: ${profile.accountNumber}\nIFSC: ${profile.ifsc}\nMICR: ${profile.micr}\nBranch: ${profile.branch}\nCustomer ID: ${profile.customerId}`;
                    if (navigator?.clipboard?.writeText) {
                      navigator.clipboard.writeText(fullText);
                    }
                    onToast('Full account text slip copied to clipboard!', 'success');
                  }}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Copy Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Account Details PDF generated for ${profile.name} (A/C: ${profile.accountNumber}). Downloading...`);
                    onToast('PDF Account Slip downloaded successfully!', 'success');
                    setIsShareModalOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#0A2E65] hover:bg-[#071f45] text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/20"
                >
                  <Download className="w-3.5 h-3.5 text-orange-400" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
