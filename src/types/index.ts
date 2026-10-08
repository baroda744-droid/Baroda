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
  date: string; // e.g. "01/01/25"
  narration: string; // particulars
  amount: number;
  type: 'debit' | 'credit' | 'info';
  balanceAfter: number;
  balanceStr?: string; // e.g. "57500,00,01,402.06Cr"
  chqNo?: string; // e.g. "SWIFT/00487771418/3654/USD 66,860,465,116.28/10:10:17"
  withdrawals?: string; // e.g. "10000.00"
  deposits?: string; // e.g. "57500,00,00,000.00cr"
  charges?: number;
  tag?: string; // e.g. "UPI"
  utrNo: string;
  txnId: string;
  ifsc: string;
  refNo: string;
  remarks: string;
  mode: 'UPI' | 'NEFT' | 'IMPS' | 'ATM' | 'POS' | 'INT' | 'SWIFT' | 'ACH';
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
  crn?: string;
  mobile: string;
  email: string;
  pan: string;
  address: string;
}

export type AppScreen = 'splash' | 'onboarding' | 'permissions' | 'dashboard' | 'analytics' | 'profile' | 'mpassbook';
export type MainTab = 'save' | 'invest' | 'borrow' | 'shop';
