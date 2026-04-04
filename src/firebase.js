import { initializeApp } from 'firebase/app';
import { CustomProvider, initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import log from "loglevel";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = getAuth(app);

// ── Data Connect ──────────────────────────────────────────────────────────────
// Descomenta SOLO cuando hayas corrido `firebase dataconnect:sdk:generate`
// import { getDataConnect } from "firebase/data-connect";
// export const dataConnect = getDataConnect(app);

// ── App Check ─────────────────────────────────────────────────────────────────
const IS_DEV = import.meta.env.DEV;
const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_KEY;

let _appCheck = null;

const initAppCheck = () => {
  try {
    if (IS_DEV) {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    _appCheck = initializeAppCheck(app, {
      provider: IS_DEV
        ? new CustomProvider({
            getToken: async () => {
              return { token: 'debug', expireTimeMillis: Date.now() + 3600000 };
            },
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

export const getAppCheck = () => _appCheck;
export default app;
