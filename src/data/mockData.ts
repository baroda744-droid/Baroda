import { BankAccount, Transaction, FixedDepositItem } from '../types';

export const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc-1',
    accountNumber: '87090200000008',
    maskedNumber: 'XXXX XXXX XXXX 0008',
    accountType: 'Current Account',
    balance: 575000001402.06,
    bankName: 'Bank of Baroda',
    branch: 'Nagari Branch, Chittoor',
    ifsc: 'BARB0NAGARI',
    isPrimary: true,
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-swift-1',
    title: 'DEUTCHE BANK AG - SWIFT INWARD',
    recipient: 'DEUTCHE BANK AG//DUE TO ACCOUNT HAS BEEN FREEZE',
    accountNo: 'SWIFT/00487771418/3654',
    amount: 575000000000,
    type: 'credit',
    category: 'transfer',
    date: '08/01/25',
    time: '10:10 AM',
    refNumber: 'USD 66,860,465,116.28',
    status: 'Completed',
  },
  {
    id: 'tx-2',
    title: 'BharatPe Merchant Payment',
    recipient: 'BHARATPE90725308056',
    amount: 340,
    type: 'debit',
    category: 'transfer',
    date: '07/01/25',
    time: '07:32 PM',
    refNumber: 'UPI/097734466121',
    status: 'Completed',
  },
  {
    id: 'tx-3',
    title: 'UPI Transfer',
    recipient: '9985027699-4@ybl/Pa',
    amount: 350,
    type: 'debit',
    category: 'transfer',
    date: '05/01/25',
    time: '01:58 PM',
    refNumber: 'UPI/792564743154',
    status: 'Completed',
  },
  {
    id: 'tx-4',
    title: 'UPI Outward Transfer',
    recipient: '9087085454@ybl/Paym',
    amount: 10000,
    type: 'debit',
    category: 'transfer',
    date: '04/01/25',
    time: '07:46 PM',
    refNumber: 'UPI/731313933983',
    status: 'Completed',
  },
  {
    id: 'tx-5',
    title: 'UPI Inward Credit',
    recipient: '9087085454@axl/Paym',
    amount: 2600,
    type: 'credit',
    category: 'transfer',
    date: '03/01/25',
    time: '07:14 PM',
    refNumber: 'UPI/336433828495',
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
