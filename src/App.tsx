import React, { useState, useEffect } from 'react';
import {
  AppScreen,
  BankAccount,
  Transaction,
} from './types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Screen1Onboarding } from './components/Screen1Onboarding';
import { Screen2Permissions } from './components/Screen2Permissions';
import { Screen3Dashboard } from './components/Screen3Dashboard';
import { Screen4Analytics } from './components/Screen4Analytics';
import { ScreenProfile } from './components/ScreenProfile';
import { ScreenMPassbook } from './components/ScreenMPassbook';
import { SendMoneyModal } from './components/modals/SendMoneyModal';
import { SendToMobileModal } from './components/modals/SendToMobileModal';
import { MpinModal } from './components/modals/MpinModal';
import { AccountsListModal } from './components/modals/AccountsListModal';
import { VoicePaymentModal } from './components/modals/VoicePaymentModal';
import { QrScannerModal } from './components/modals/QrScannerModal';
import { FdCalculatorModal } from './components/modals/FdCalculatorModal';
import { CardsModal } from './components/modals/CardsModal';
import { NotificationModal } from './components/modals/NotificationModal';
import { SearchModal } from './components/modals/SearchModal';
import { MoreMenuModal } from './components/modals/MoreMenuModal';
import { BiometricAuthModal } from './components/modals/BiometricAuthModal';
import { SplashScreen } from './components/SplashScreen';
import { ToastContainer, ToastMessage } from './components/modals/Toast';
import { BobSunIcon } from './components/BobSunIcon';

export default function App() {
  // Linear Flow: User Authentication State with localStorage guard
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bob_is_logged_in') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Screen State: Starts with BOB World splash animation, directly navigates to LOGIN PAGE
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');

  const [activeNavTab, setActiveNavTab] = useState<'home' | 'passbook' | 'upi' | 'cards' | 'analytics' | 'more'>('home');

  // Banking State with LocalStorage persistence
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    try {
      const saved = localStorage.getItem('aarya_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[0] && (parsed[0].balance === 213560.50 || parsed[0].balance < 1000000)) {
          parsed[0].balance = 575000001402.06;
          parsed[0].bankName = 'Bank of Baroda';
          parsed[0].branch = 'Chennai Main Branch';
          parsed[0].ifsc = 'BARB0CHENNA';
          return parsed;
        }
        return parsed;
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('aarya_transactions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_TRANSACTIONS;
  });

  const [showBalance, setShowBalance] = useState<boolean>(true);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('aarya_accounts', JSON.stringify(accounts));
    } catch (e) {
      // ignore
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('aarya_transactions', JSON.stringify(transactions));
    } catch (e) {
      // ignore
    }
  }, [transactions]);

  // Modals
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
  const [isSendMobileOpen, setIsSendMobileOpen] = useState(false);
  const [isMpinOpen, setIsMpinOpen] = useState(false);
  const [mpinTargetScreen, setMpinTargetScreen] = useState<AppScreen | null>(null);
  const [isAccountsListOpen, setIsAccountsListOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isFdCalculatorOpen, setIsFdCalculatorOpen] = useState(false);
  const [isCardsOpen, setIsCardsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);

  // Biometric Unlock configuration from localStorage
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
      if (saved === 'fingerprint' || saved === 'face' || saved === 'both') return saved;
    } catch (e) {}
    return 'both';
  });

  // Keep biometric states synced with localStorage changes across screens
  useEffect(() => {
    const refreshBiometricState = () => {
      try {
        setIsBiometricEnabled(localStorage.getItem('bob_biometric_enabled') === 'true');
        const savedType = localStorage.getItem('bob_biometric_type');
        if (savedType === 'fingerprint' || savedType === 'face' || savedType === 'both') {
          setBiometricType(savedType);
        }
      } catch (e) {}
    };

    refreshBiometricState();
    window.addEventListener('storage', refreshBiometricState);
    return () => window.removeEventListener('storage', refreshBiometricState);
  }, [currentScreen]);

  // Linear flow navigation guard
  const handleProtectedNavigation = (screen: AppScreen) => {
    if (!isLoggedIn && screen !== 'onboarding' && screen !== 'permissions') {
      addToast('Please login with MPIN to access your account.', 'warning');
      setCurrentScreen('onboarding');
      return;
    }
    setCurrentScreen(screen);
  };

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fund Transfer handler - Always blocked due to Account Freezed
  const handlePaymentSuccess = (newTx: Transaction, newBalance: number) => {
    addToast(
      'Transaction Failed: Account Freezed - Security Hold (Code: ACCT_FRZ_001)',
      'warning'
    );
  };

  // UPI QR Scan Pay Handler - Always blocked due to Account Freezed
  const handleScanPaySuccess = (merchant: string, amount: number) => {
    addToast(
      'Transaction Failed: Account Freezed - Security Hold (Code: ACCT_FRZ_001)',
      'warning'
    );
  };

  // Navigation controller with MPIN trigger
  const triggerLoginFlow = (target: AppScreen = 'permissions') => {
    setMpinTargetScreen(target);
    setIsMpinOpen(true);
  };

  const primaryAccount = accounts.find((a) => a.isPrimary) || accounts[0];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start antialiased text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      {/* GLOBAL TOAST CONTAINER */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* MAIN MOBILE APP CONTAINER */}
      <main className="w-full max-w-[430px] mx-auto bg-[#FFF6F0] min-h-screen relative shadow-2xl shadow-black/40 flex flex-col">

        {/* Top Header shown on Screen 3 and Screen 4 */}
        {(currentScreen === 'dashboard' || currentScreen === 'analytics') && (
          <Header
            userName="Aarya"
            onSearchClick={() => setIsSearchOpen(true)}
            onNotificationClick={() => setIsNotificationOpen(true)}
            onProfileClick={() => {
              setCurrentScreen('profile');
              addToast('Opening My Profile / Account Details...', 'info');
            }}
            onLogout={() => {
              setIsLoggedIn(false);
              try {
                localStorage.removeItem('bob_is_logged_in');
              } catch (e) {}
              setCurrentScreen('onboarding');
              addToast('Logged out securely. Session closed.', 'info');
            }}
          />
        )}

        {/* SCREEN 0: BOB WORLD SPLASH ANIMATION */}
        {currentScreen === 'splash' && (
          <SplashScreen onFinish={() => setCurrentScreen('onboarding')} />
        )}

        {/* SCREEN 1: ONBOARDING / LOGIN START */}
        {currentScreen === 'onboarding' && (
          <Screen1Onboarding
            onLoginClick={() => {
              setMpinTargetScreen('dashboard');
              setIsMpinOpen(true);
            }}
            onBiometricLoginClick={() => {
              setMpinTargetScreen('dashboard');
              setIsBiometricModalOpen(true);
            }}
            isBiometricEnabled={isBiometricEnabled}
            biometricType={biometricType}
            onToast={addToast}
            onExploreFeature={(title, desc) => {
              addToast(`${title}: Feature working`, 'info');
            }}
          />
        )}

        {/* SCREEN 2: PERMISSIONS */}
        {currentScreen === 'permissions' && (
          <Screen2Permissions
            onConfirm={() => {
              setIsLoggedIn(true);
              try {
                localStorage.setItem('bob_is_logged_in', 'true');
              } catch (e) {}
              setCurrentScreen('dashboard');
              setActiveNavTab('home');
              addToast('Permissions verified! Welcome to bob World.', 'success');
            }}
            onBackToStart={() => setCurrentScreen('onboarding')}
          />
        )}

        {/* SCREEN 3: DASHBOARD */}
        {currentScreen === 'dashboard' && (
          <div className="px-4">
            <Screen3Dashboard
              accounts={accounts}
              transactions={transactions}
              showBalance={showBalance}
              onToggleBalance={() => {
                setShowBalance(!showBalance);
                addToast(showBalance ? 'Account balances hidden' : 'Account balances visible', 'info');
              }}
              onOpenAccountsList={() => setIsAccountsListOpen(true)}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              onOpenBankTransfer={() => setIsSendMoneyOpen(true)}
              onOpenSendMobile={() => setIsSendMobileOpen(true)}
              onOpenFdCalculator={() => setIsFdCalculatorOpen(true)}
              onNavigateToScreen4={() => {
                setCurrentScreen('analytics');
                setActiveNavTab('analytics');
              }}
              onQuickPayMobile={(payee) => {
                setIsSendMobileOpen(true);
              }}
              onToast={addToast}
            />
          </div>
        )}

        {/* SCREEN 4: FD/RD + ANALYTICS */}
        {currentScreen === 'analytics' && (
          <div className="px-4">
            <Screen4Analytics
              onBackToHome={() => {
                setCurrentScreen('dashboard');
                setActiveNavTab('home');
              }}
              onToast={addToast}
            />
          </div>
        )}

        {/* NEW PAGE: MY PROFILE / ACCOUNT DETAILS */}
        {currentScreen === 'profile' && (
          <div className="px-4">
            <ScreenProfile
              onBack={() => {
                setCurrentScreen('dashboard');
                setActiveNavTab('home');
              }}
              onLogout={() => {
                setIsLoggedIn(false);
                try {
                  localStorage.removeItem('bob_is_logged_in');
                } catch (e) {}
                setCurrentScreen('onboarding');
                setActiveNavTab('home');
                addToast('Logged out securely. Session closed.', 'info');
              }}
              onToast={addToast}
            />
          </div>
        )}

        {/* M-PASSBOOK SCREEN */}
        {currentScreen === 'mpassbook' && (
          <div className="w-full">
            <ScreenMPassbook
              onBack={() => {
                setCurrentScreen('dashboard');
                setActiveNavTab('home');
              }}
              onToast={addToast}
              balance={primaryAccount.balance}
              accountNumber={primaryAccount.maskedNumber}
            />
          </div>
        )}

        {/* FIXED BOTTOM NAVIGATION (Shown on Screens 3, 4, Profile & M-Passbook) */}
        {(currentScreen === 'dashboard' || currentScreen === 'analytics' || currentScreen === 'profile' || currentScreen === 'mpassbook') && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={(scr) => handleProtectedNavigation(scr)}
            activeNavTab={activeNavTab}
            onNavTabChange={(tab) => setActiveNavTab(tab)}
            onOpenUpiScan={() => setIsQrScannerOpen(true)}
            onOpenCards={() => setIsCardsOpen(true)}
            onOpenMore={() => setIsMoreMenuOpen(true)}
          />
        )}
      </main>

      {/* INTERACTIVE MODALS & DRAWERS */}

      {/* 1. MPIN Keypad Modal */}
      <MpinModal
        isOpen={isMpinOpen}
        onClose={() => setIsMpinOpen(false)}
        onTriggerBiometric={() => {
          setIsMpinOpen(false);
          setIsBiometricModalOpen(true);
        }}
        onSuccess={() => {
          setIsMpinOpen(false);
          setIsLoggedIn(true);
          try {
            localStorage.setItem('bob_is_logged_in', 'true');
          } catch (e) {}
          const target = mpinTargetScreen || 'dashboard';
          setCurrentScreen(target);
          setActiveNavTab('home');
          addToast('Welcome back, Aarya! Logged in to bob World.', 'success');
        }}
        title="Enter 4-Digit Login MPIN"
        subtitle="Security verification for bob World"
      />

      {/* 1b. Biometric Unlock Modal (Face ID / Fingerprint) */}
      <BiometricAuthModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        onSuccess={() => {
          setIsBiometricModalOpen(false);
          setIsLoggedIn(true);
          try {
            localStorage.setItem('bob_is_logged_in', 'true');
          } catch (e) {}
          const target = mpinTargetScreen || 'dashboard';
          setCurrentScreen(target);
          setActiveNavTab('home');
          addToast('Biometric verified! Welcome to bob World.', 'success');
        }}
        onFallbackToMpin={() => {
          setIsBiometricModalOpen(false);
          setIsMpinOpen(true);
        }}
        biometricType={biometricType}
        title="bob World Biometric Unlock"
      />

      {/* 2. Blank Input Send To Mobile Number Modal */}
      <SendToMobileModal
        isOpen={isSendMobileOpen}
        onClose={() => setIsSendMobileOpen(false)}
        primaryAccount={primaryAccount}
        onSuccess={handlePaymentSuccess}
      />

      {/* 3. Bank Transfer Modal (To Account No, Confirm, IFSC, Beneficiary, Amount, Remarks, Receipt) */}
      <SendMoneyModal
        isOpen={isSendMoneyOpen}
        onClose={() => setIsSendMoneyOpen(false)}
        primaryAccount={primaryAccount}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 4. Single Self Account Modal */}
      <AccountsListModal
        isOpen={isAccountsListOpen}
        onClose={() => setIsAccountsListOpen(false)}
        accounts={accounts}
        showBalance={showBalance}
        onNavigateToPassbook={() => {
          setIsAccountsListOpen(false);
          setCurrentScreen('mpassbook');
          setActiveNavTab('passbook');
        }}
      />

      {/* 4. AI Voice Payment Modal */}
      <VoicePaymentModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onExecuteCommand={(cmd) => {
          if (cmd.includes('Rahul')) {
            setIsSendMoneyOpen(true);
            addToast(`Executing Voice Command: "${cmd}"`, 'info');
          } else if (cmd.includes('Fixed Deposit')) {
            setCurrentScreen('analytics');
            setIsFdCalculatorOpen(true);
            addToast(`Opening Term Deposit flow...`, 'info');
          } else {
            addToast(`Voice assistant answered: "${cmd}"`, 'info');
          }
        }}
      />

      {/* 5. UPI QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onScanSuccess={handleScanPaySuccess}
      />

      {/* 6. Term Deposit Compound Calculator Modal */}
      <FdCalculatorModal
        isOpen={isFdCalculatorOpen}
        onClose={() => setIsFdCalculatorOpen(false)}
        onBookDeposit={(p, m, mat) => {
          addToast(`Booked new Fixed Deposit of ₹${p.toLocaleString('en-IN')}!`, 'success');
          setCurrentScreen('analytics');
        }}
      />

      {/* 8. Debit & Virtual Cards Modal */}
      <CardsModal
        isOpen={isCardsOpen}
        onClose={() => setIsCardsOpen(false)}
        onToast={addToast}
      />

      {/* 9. Push Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* 10. Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAction={(actionKey) => {
          if (actionKey === 'transfer_bank') setIsSendMoneyOpen(true);
          else if (actionKey === 'transfer_mobile') {
            setIsSendMoneyOpen(true);
          } else if (actionKey === 'open_fd' || actionKey === 'analytics') {
            setCurrentScreen('analytics');
          } else if (actionKey === 'profile') {
            setCurrentScreen('profile');
          } else if (actionKey === 'calculator') {
            setIsFdCalculatorOpen(true);
          } else if (actionKey === 'cards') {
            setIsCardsOpen(true);
          } else if (actionKey === 'support') {
            addToast('Connecting to Bank of Baroda 24x7 Helpline: 1800 5700', 'info');
          }
        }}
      />

      {/* 11. More Services Menu Modal */}
      <MoreMenuModal
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          if (screen === 'dashboard') setActiveNavTab('home');
          if (screen === 'analytics') setActiveNavTab('analytics');
        }}
        onToast={addToast}
      />
    </div>
  );
}
