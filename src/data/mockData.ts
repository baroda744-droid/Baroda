import { BankAccount, Transaction, FixedDepositItem } from '../types';

export const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc-1',
    accountNumber: '409188201234',
    maskedNumber: 'XXXX XXXX 1234',
    accountType: 'Savings Account',
    balance: 213560.50,
    bankName: 'Aarya Bank',
    branch: 'Chennai Main Branch',
    ifsc: 'BARB0AARYA01',
    isPrimary: true,
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Transfer to Rahul Sharma',
    recipient: 'Rahul Sharma (HDFC Bank)',
    accountNo: '•••• 4920',
    amount: 12500,
    type: 'debit',
    category: 'transfer',
    date: 'Today',
    time: '02:30 PM',
    refNumber: 'ARYA7849102941',
    status: 'Completed',
  },
  {
    id: 'tx-2',
    title: 'Monthly Salary Credited',
    recipient: 'TechCorp India Pvt Ltd',
    amount: 95000,
    type: 'credit',
    category: 'transfer',
    date: 'Yesterday',
    time: '10:00 AM',
    refNumber: 'ARYA9028374112',
    status: 'Completed',
  },
  {
    id: 'tx-3',
    title: 'Amazon Online Shopping',
    recipient: 'Amazon Pay India',
    amount: 2499,
    type: 'debit',
    category: 'shopping',
    date: '04 Oct 2026',
    time: '08:15 PM',
    refNumber: 'ARYA5529104882',
    status: 'Completed',
  },
  {
    id: 'tx-4',
    title: 'Adani Electricity Bill',
    recipient: 'Adani Electricity Mumbai',
    amount: 3120,
    type: 'debit',
    category: 'bills',
    date: '02 Oct 2026',
    time: '11:45 AM',
    refNumber: 'ARYA3940192849',
    status: 'Completed',
  },
  {
    id: 'tx-5',
    title: 'Dividend Credit - TCS Ltd',
    recipient: 'Tata Consultancy Services',
    amount: 4200,
    type: 'credit',
    category: 'investment',
    date: '28 Sep 2026',
    time: '04:12 PM',
    refNumber: 'ARYA1192837465',
    status: 'Completed',
  },
];

export const SAMPLE_FD: FixedDepositItem = {
  accountNumber: '5413 7700 9812',
  principalAmount: 450000,
  maturityAmount: 524850,
  interestRate: 7.75,
  bookingDate: '18 Nov 2025',
  maturityDate: '18 Nov 2027',
  tenureMonths: 24,
  nominee: 'Ananya Patel (Spouse)',
  status: 'Active',
};

export const RECENT_PAYEES = [
  { name: 'Rahul Sharma', upi: 'rahul.s@oksbi', bank: 'HDFC Bank', avatar: 'RS', phone: '+91 98201 44521' },
  { name: 'Priya Verma', upi: 'priya.v@okaxis', bank: 'ICICI Bank', avatar: 'PV', phone: '+91 98192 77341' },
  { name: 'Amit Desai', upi: 'amit.d@okicici', bank: 'Bank of Baroda', avatar: 'AD', phone: '+91 97654 32109' },
  { name: 'Sunita Joshi', upi: 'sunita.j@paytm', bank: 'SBI Bank', avatar: 'SJ', phone: '+91 99887 66554' },
];

export const INTEREST_RATE_SLABS = [
  { tenure: '7 days to 14 days', general: '3.00%', senior: '3.50%' },
  { tenure: '15 days to 45 days', general: '4.50%', senior: '5.00%' },
  { tenure: '46 days to 180 days', general: '5.75%', senior: '6.25%' },
  { tenure: '181 days to 364 days', general: '6.50%', senior: '7.00%' },
  { tenure: '1 Year to 2 Years', general: '7.25%', senior: '7.75%' },
  { tenure: '2 Years to 3 Years (Special)', general: '7.75%', senior: '8.25%' },
  { tenure: 'Above 3 Years to 5 Years', general: '7.00%', senior: '7.50%' },
  { tenure: '5 Years to 10 Years (Tax Saver)', general: '6.75%', senior: '7.35%' },
];
