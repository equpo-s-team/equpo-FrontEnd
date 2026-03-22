import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
    initializeAppCheck,
    ReCaptchaV3Provider,
    CustomProvider,
} from "firebase/app-check";

const firebaseConfig = {
    apiKey: "AIzaSyB3L1RcAXfQga9h3rCUTrE9L2Fo7lvxbxc",
    authDomain: "equpo1.firebaseapp.com",
    projectId: "equpo1",
    storageBucket: "equpo1.firebasestorage.app",
    messagingSenderId: "142374715720",
    appId: "1:142374715720:web:1459c81a81f778f3d8b37d",
    measurementId: "G-60W36384HH"
};

const app = initializeApp(firebaseConfig);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = getAuth(app);

// ── Data Connect ──────────────────────────────────────────────────────────────
// Descomenta SOLO cuando hayas corrido `firebase dataconnect:sdk:generate`
// import { getDataConnect } from "firebase/data-connect";
// export const dataConnect = getDataConnect(app);

// ── App Check ─────────────────────────────────────────────────────────────────
// En desarrollo (localhost) usamos el debug provider para evitar errores 400 de
// reCAPTCHA. En producción se usa reCAPTCHA v3 real.
//
// PASOS PARA DESARROLLO:
//   1. Al arrancar el proyecto verás en la consola:
//      "App Check debug token: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
//   2. Ve a Firebase Console → App Check → Apps → tu app → Manage debug tokens
//   3. Agrega ese token. Listo, App Check funciona en localhost sin reCAPTCHA.
//
// PASOS PARA PRODUCCIÓN:
//   • Asegúrate de que VITE_RECAPTCHA_KEY esté en tu .env de producción.
//   • El build usará automáticamente ReCaptchaV3Provider.

const IS_DEV = import.meta.env.DEV; // true en `vite dev`, false en `vite build`
const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_KEY
    ?? '6LeDxIssAAAAAPvKDYWLa5xtcsonxlBcbD16gGQk';

let _appCheck = null;

const initAppCheck = () => {
    try {
        if (IS_DEV) {
            // Activa el debug provider — genera un token en consola la primera vez
            // @ts-ignore
            self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
        }

        _appCheck = initializeAppCheck(app, {
            provider: IS_DEV
                ? new CustomProvider({
                    getToken: async () => {
                        // El SDK intercepta esto cuando DEBUG_TOKEN = true
                        // y devuelve el token de debug automáticamente.
                        return { token: 'debug', expireTimeMillis: Date.now() + 3600000 };
                    },
                })
                : new ReCaptchaV3Provider(RECAPTCHA_KEY),
            isTokenAutoRefreshEnabled: true,
        });

        if (IS_DEV) {
            console.info(
                '[Firebase] App Check en modo DEBUG. ' +
                'Registra el token de consola en Firebase Console → App Check.'
            );
        }
    } catch (err) {
        // App Check nunca debe romper la app; auth funciona igual sin él
        console.warn('[Firebase] App Check no se pudo inicializar:', err);
    }
};

initAppCheck();

export const getAppCheck = () => _appCheck;
export default app;