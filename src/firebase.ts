import { type FirebaseApp, initializeApp } from 'firebase/app';
import {
  type AppCheck,
  CustomProvider,
  initializeAppCheck,
  ReCaptchaV3Provider,
} from 'firebase/app-check';
import { type Auth, getAuth } from 'firebase/auth';
import { type Database, getDatabase } from 'firebase/database';
import { type Firestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import log from 'loglevel';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
};

const app: FirebaseApp = initializeApp(firebaseConfig);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const auth: Auth = getAuth(app);

// ── Firestore & Storage ───────────────────────────────────────────────────────

export const db: Firestore = getFirestore(app);
export const storage = getStorage(app);

// ── Realtime Database ─────────────────────────────────────────────────────────

export const rtdb: Database = getDatabase(app);

export const realtimeDb: Database = getDatabase(app);

export const realtimeDb: Database = getDatabase(app);

export const realtimeDb: Database = getDatabase(app);

export const realtimeDb: Database = getDatabase(app);

export const realtimeDb: Database = getDatabase(app);

export const realtimeDb: Database = getDatabase(app);

// ── Data Connect ──────────────────────────────────────────────────────────────
// Descomenta SOLO cuando hayas corrido `firebase dataconnect:sdk:generate`
// import { getDataConnect } from "firebase/data-connect";
// export const dataConnect = getDataConnect(app);

// ── App Check ─────────────────────────────────────────────────────────────────
const IS_DEV: boolean = import.meta.env.DEV;
const RECAPTCHA_KEY: string = import.meta.env.VITE_RECAPTCHA_KEY as string;

let _appCheck: AppCheck | null = null;

const initAppCheck = (): void => {
  try {
    if (IS_DEV) {
      (self as unknown as Record<string, unknown>).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    _appCheck = initializeAppCheck(app, {
      provider: IS_DEV
        ? new CustomProvider({
            getToken: () =>
              Promise.resolve({
                token: 'debug',
                expireTimeMillis: Date.now() + 3_600_000,
              }),
          })
        : new ReCaptchaV3Provider(RECAPTCHA_KEY),
      isTokenAutoRefreshEnabled: true,
    });

    if (IS_DEV) {
      log.info(
        '[Firebase] App Check en modo DEBUG. ' +
          'Registra el token de consola en Firebase Console → App Check.',
      );
    }
  } catch (err) {
    log.warn('[Firebase] App Check no se pudo inicializar:', err);
  }
};

initAppCheck();

export const getAppCheck = (): AppCheck | null => _appCheck;
export default app;
