export interface BankAccount {
  id: string;
  accountNumber: string;
  maskedNumber: string;
  accountType: 'Savings Account' | 'Salary Account' | 'Current Account' | 'Fixed Deposit' | 'Recurring Deposit';
  balance: number;
  bankName: string;
  branch: string;
  ifsc: string;
  isPrimary?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  recipient: string;
  accountNo?: string;
  amount: number;
  type: 'debit' | 'credit';
  category: 'transfer' | 'shopping' | 'bills' | 'investment' | 'deposit';
  date: string;
  time: string;
  refNumber: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface MPassbookTransaction {
  id: string;
  date: string; // e.g. "12 Oct 2026"
  narration: string; // e.g. "UPI/DR/62848877/bob World/Rahul/SBIN"
  amount: number;
  type: 'debit' | 'credit';
  balanceAfter: number;
  charges?: number;
  tag?: string; // e.g. "UPI"
  utrNo: string;
  txnId: string;
  ifsc: string;
  refNo: string;
  remarks: string;
  mode: 'UPI' | 'NEFT' | 'IMPS' | 'ATM' | 'POS' | 'INT';
  status?: 'success' | 'failed';
  reason?: string;
  toAccount?: string;
}

export interface FixedDepositItem {
  accountNumber: string;
  principalAmount: number;
  maturityAmount: number;
  interestRate: number;
  bookingDate: string;
  maturityDate: string;
  tenureMonths: number;
  nominee: string;
  status: 'Active';
}

export interface UserProfileData {
  name: string;
  accountNumber: string;
  maskedAccountNumber: string;
  accountType: string;
  ifsc: string;
  micr: string;
  branch: string;
  customerId: string;
  mobile: string;
  email: string;
  pan: string;
  address: string;
}

export type AppScreen = 'onboarding' | 'permissions' | 'dashboard' | 'analytics' | 'profile' | 'mpassbook';
export type MainTab = 'save' | 'invest' | 'borrow' | 'shop';
