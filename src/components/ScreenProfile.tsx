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
  LogOut,
  Fingerprint,
  ScanFace,
  Lock,
  Sparkles,
} from 'lucide-react';
import { UserProfileData } from '../types';
import { BobSunIcon } from './BobSunIcon';
import { BiometricAuthModal } from './modals/BiometricAuthModal';

interface ScreenProfileProps {
  onBack: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  onLogout?: () => void;
}

const DEFAULT_PROFILE: UserProfileData = {
  name: 'RAPOODDIN C',
  accountNumber: '8709 0200 0000 08',
  maskedAccountNumber: 'XXXX XXXX XXXX 0008',
  accountType: 'Current',
  ifsc: 'BARB0NAGARI',
  micr: '517012006',
  branch: 'Bank of Baroda - Nagari Branch',
  customerId: '10670093127',
  crn: '10670093127',
  mobile: '+91 98401 23456',
  email: 'rapooddin.c@email.com',
  pan: 'EPXPR1547R',
  address: 'Chittoor, Andhra Pradesh',
};

export const ScreenProfile: React.FC<ScreenProfileProps> = ({ onBack, onToast, onLogout }) => {
  // Load profile from localStorage or default
  const [profile, setProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem('bob_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.accountNumber === '8709 0200 0000 08' || parsed.accountNumber === '87090200000008') {
          return parsed;
        }
      }
    } catch (e) {
      // fallback
    }
    try {
      localStorage.setItem('bob_user_profile', JSON.stringify(DEFAULT_PROFILE));
    } catch (e) {}
    return DEFAULT_PROFILE;
  });

  // Hide/Show Account Number Toggle
  const [showFullAccount, setShowFullAccount] = useState(false);

  // Copy feedback states
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Share statement preview modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Biometric Authentication State stored in localStorage
  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bob_biometric_enabled') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [biometricType, setBiometricType] = useState<'both' | 'fingerprint' | 'face'>(() => {
    try {
      const saved = localStorage.getItem('bob_biometric_type');
      if (saved === 'fingerprint' || saved === 'face' || saved === 'both') {
        return saved;
      }
    } catch (e) {}
    return 'both';
  });

  const [isTestBiometricOpen, setIsTestBiometricOpen] = useState(false);

  const handleToggleBiometric = () => {
    const nextVal = !isBiometricEnabled;
    setIsBiometricEnabled(nextVal);
    try {
      localStorage.setItem('bob_biometric_enabled', nextVal ? 'true' : 'false');
    } catch (e) {}

    if (nextVal) {
      onToast('Biometric unlock enabled! You can now use Fingerprint or Face ID on login.', 'success');
    } else {
      onToast('Biometric unlock disabled. 4-Digit MPIN will be required to log in.', 'info');
    }
  };

  const handleSelectBiometricType = (type: 'both' | 'fingerprint' | 'face') => {
    setBiometricType(type);
    try {
      localStorage.setItem('bob_biometric_type', type);
    } catch (e) {}
    const label = type === 'face' ? 'Face ID / Facial Recognition' : type === 'fingerprint' ? 'Fingerprint / Touch ID' : 'Face ID & Fingerprint';
    onToast(`Biometric preference updated: ${label}`, 'info');
  };

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
      {/* TOP HEADER: Back button + Title + Top Right Actions (Share + Log Out) */}
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

        {/* Top Right Actions: Share PDF & Log Out */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6B00] border border-orange-200/80 active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="Share account details PDF"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Log Out Button (Top Right) */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs border border-red-200 active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="Log Out of Session"
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
            <span>Log out</span>
          </button>
        </div>
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

            {/* 3. CRN Number (Customer Relationship Number) [Copy icon] */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-orange-50/40 transition-colors">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  3. CRN Number
                </span>
                <span className="font-mono font-black text-sm text-[#0A2E65]">
                  {profile.crn || '10670093127'}
                </span>
              </div>
              <button
                onClick={() => handleCopy(profile.crn || '10670093127', 'CRN Number')}
                className="p-2 rounded-xl bg-white hover:bg-orange-100 text-slate-700 hover:text-[#FF6B00] border border-slate-200 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs font-bold text-[11px]"
                title="Copy CRN Number"
              >
                {copiedField === 'CRN Number' ? (
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

            {/* 4. Branch */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  4. Home Branch
                </span>
                <span className="font-extrabold text-xs text-slate-800">
                  {profile.branch}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold bg-white px-2 py-1 rounded-lg border border-slate-200">
                Chittoor, AP
              </span>
            </div>

            {/* 5. Customer ID */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  5. Customer ID / CIF
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

        {/* CARD 4: APP SECURITY & BIOMETRIC LOGIN SETTINGS */}
        <div className="bg-white rounded-3xl p-5 shadow-lg shadow-orange-950/5 border border-orange-100/80">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-orange-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF6B00]">
                <Fingerprint className="w-4 h-4 text-[#FF6B00]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#0A2E65] leading-tight">
                  Security & Biometric Unlock
                </h3>
                <p className="text-[10px] text-slate-400">
                  Instant login via Face ID or Fingerprint
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0A2E65] border border-blue-100">
              FIDO2 Protected
            </span>
          </div>

          {/* Toggle Row */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                isBiometricEnabled
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}>
                {biometricType === 'face' ? (
                  <ScanFace className="w-5 h-5" />
                ) : (
                  <Fingerprint className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#0A2E65]">
                    Biometric Authentication
                  </span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    isBiometricEnabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isBiometricEnabled ? 'ACTIVE' : 'OFF'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Log into bob World quickly using device biometrics instead of typing MPIN.
                </p>
              </div>
            </div>

            {/* Interactive Switch Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={isBiometricEnabled}
              onClick={handleToggleBiometric}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isBiometricEnabled ? 'bg-[#FF6B00]' : 'bg-slate-300'
              }`}
            >
              <span className="sr-only">Toggle Biometric Authentication</span>
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isBiometricEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sub-options when Biometric is Enabled */}
          {isBiometricEnabled && (
            <div className="mt-3.5 space-y-3 pt-3 border-t border-slate-100 animate-in fade-in duration-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Select Biometric Method
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectBiometricType('both')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    biometricType === 'both'
                      ? 'bg-orange-50 border-[#FF6B00] text-[#FF6B00] shadow-2xs ring-1 ring-[#FF6B00]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Both (Auto)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectBiometricType('fingerprint')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    biometricType === 'fingerprint'
                      ? 'bg-orange-50 border-[#FF6B00] text-[#FF6B00] shadow-2xs ring-1 ring-[#FF6B00]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Fingerprint className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Fingerprint</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectBiometricType('face')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    biometricType === 'face'
                      ? 'bg-orange-50 border-[#FF6B00] text-[#FF6B00] shadow-2xs ring-1 ring-[#FF6B00]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ScanFace className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Face ID</span>
                </button>
              </div>

              {/* Test Biometric Unlock Button */}
              <button
                type="button"
                onClick={() => setIsTestBiometricOpen(true)}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#FF6B00] font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Test Biometric Sensor</span>
              </button>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Biometric keys are stored locally in device hardware secure storage (localStorage: bob_biometric_enabled).</span>
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

        {/* LOG OUT BUTTON */}
        <button
          onClick={onLogout}
          className="w-full py-3.5 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span>Log Out & Lock Session</span>
        </button>
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
                    onToast(`PDF Account Slip downloaded successfully for ${profile.name}!`, 'success');
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

      {/* TEST BIOMETRIC MODAL */}
      <BiometricAuthModal
        isOpen={isTestBiometricOpen}
        onClose={() => setIsTestBiometricOpen(false)}
        onSuccess={() => {
          setIsTestBiometricOpen(false);
          onToast('Biometric sensor test passed! Your device is ready.', 'success');
        }}
        biometricType={biometricType}
        title="Test Device Biometrics"
      />
    </div>
  );
};
