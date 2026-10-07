import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  doc,
  getDocFromServer,
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with specific databaseId if configured
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export const auth = getAuth(app);

// Validate Connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Get current user or stable UID
export const getCurrentUserId = (): string => {
  if (auth.currentUser?.uid) return auth.currentUser.uid;
  let savedUid = localStorage.getItem('bob_user_uid');
  if (!savedUid) {
    savedUid = 'usr_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('bob_user_uid', savedUid);
  }
  return savedUid;
};

// Auto sign-in anonymously if not signed in
signInAnonymously(auth).catch(() => {
  // Offline or anonymous auth restricted; stable fallback ID used
});

export interface FirestoreTransaction {
  id?: string;
  userId: string;
  type: string;
  amount: number;
  toAccount: string;
  status: 'failed' | 'success';
  reason?: string;
  date: any;
  timestamp?: any;
  narration?: string;
  utrNo?: string;
  balanceAfter?: number;
  mode?: string;
  refNo?: string;
}

/**
 * Record a failed transfer permanently in Firestore transactions collection
 */
export async function recordFailedTransaction(data: {
  amount: number;
  toAccount: string;
  reason?: string;
  type?: string;
  narration?: string;
  mode?: string;
}): Promise<string> {
  const userId = getCurrentUserId();
  const utrNo = '428' + Math.floor(100000000 + Math.random() * 900000000);
  const txnReason = data.reason || 'Account Freezed - Suspicious Activity';
  const mode = data.mode || 'UPI';

  const docPayload = {
    userId,
    type: data.type || 'transfer',
    amount: data.amount,
    toAccount: data.toAccount,
    status: 'failed',
    reason: txnReason,
    date: new Date(),
    timestamp: serverTimestamp(),
    narration:
      data.narration ||
      `${mode}/DR/${utrNo.slice(0, 8)}/To ${data.toAccount}/FAILED-FRZ`,
    utrNo,
    mode,
  };

  try {
    const docRef = await addDoc(collection(db, 'transactions'), docPayload);
    // Also save in localStorage backup
    saveToLocalStorageBackup({
      id: docRef.id,
      ...docPayload,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });
    return docRef.id;
  } catch (err) {
    console.warn('Firestore addDoc fallback to localStorage:', err);
    const localId = 'tx-fail-' + Date.now();
    saveToLocalStorageBackup({
      id: localId,
      ...docPayload,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });
    return localId;
  }
}

function saveToLocalStorageBackup(item: any) {
  try {
    const saved = localStorage.getItem('bob_failed_transactions');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift(item);
    localStorage.setItem('bob_failed_transactions', JSON.stringify(list));
  } catch (e) {}
}

export function getLocalFailedTransactions(): any[] {
  try {
    const saved = localStorage.getItem('bob_failed_transactions');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}
