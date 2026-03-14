import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const hasFirebaseEnv = Object.values(firebaseConfig).every(Boolean);

const app = hasFirebaseEnv
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app
  ? getApps().length > 1 || getApps()[0]
    ? (() => {
        try {
          return initializeFirestore(app, {
            experimentalAutoDetectLongPolling: true,
            useFetchStreams: false,
          });
        } catch {
          return getFirestore(app);
        }
      })()
    : getFirestore(app)
  : null;
