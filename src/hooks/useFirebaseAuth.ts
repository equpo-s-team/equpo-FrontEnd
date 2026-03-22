import { useState, useCallback } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile,
    AuthError,
    UserCredential,
} from 'firebase/auth';
import { auth } from '@/firebase';   // ← alias correcto; ajusta si tu firebase.js
//   está en src/firebase.js y el alias @/ = src/

export interface FirebaseAuthResult {
    success: boolean;
    error?: string;
    user?: UserCredential['user'];
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Map Firebase error codes to user-friendly Spanish/English messages
const mapFirebaseError = (error: AuthError): string => {
    switch (error.code) {
        case 'auth/user-not-found':
            return 'No existe una cuenta con este correo electrónico.';
        case 'auth/wrong-password':
            return 'Contraseña incorrecta. Por favor intenta de nuevo.';
        case 'auth/invalid-credential':
            return 'Credenciales inválidas. Verifica tu correo y contraseña.';
        case 'auth/email-already-in-use':
            return 'Ya existe una cuenta con este correo electrónico.';
        case 'auth/weak-password':
            return 'La contraseña es muy débil. Usa al menos 6 caracteres.';
        case 'auth/invalid-email':
            return 'El formato del correo electrónico no es válido.';
        case 'auth/user-disabled':
            return 'Esta cuenta ha sido deshabilitada. Contacta soporte.';
        case 'auth/too-many-requests':
            return 'Demasiados intentos fallidos. Espera un momento e intenta de nuevo.';
        case 'auth/network-request-failed':
            return 'Error de red. Verifica tu conexión a internet.';
        case 'auth/popup-closed-by-user':
            return 'Inicio de sesión cancelado.';
        case 'auth/popup-blocked':
            return 'El popup fue bloqueado. Permite los popups para este sitio.';
        case 'auth/cancelled-popup-request':
            return 'Operación cancelada.';
        case 'auth/account-exists-with-different-credential':
            return 'Ya existe una cuenta con este correo usando otro método de acceso.';
        default:
            return `Error de autenticación: ${error.message}`;
    }
};

export const useFirebaseAuth = () => {
    const [isLoading, setIsLoading] = useState(false);

    // ── Email / Password Login ──────────────────────────────────────────────────
    const loginWithEmail = useCallback(
        async (email: string, password: string): Promise<FirebaseAuthResult> => {
            setIsLoading(true);
            try {
                const credential = await signInWithEmailAndPassword(auth, email, password);
                return { success: true, user: credential.user };
            } catch (err) {
                return { success: false, error: mapFirebaseError(err as AuthError) };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // ── Email / Password Signup ─────────────────────────────────────────────────
    const signupWithEmail = useCallback(
        async (
            email: string,
            password: string,
            displayName: string
        ): Promise<FirebaseAuthResult> => {
            setIsLoading(true);
            try {
                const credential = await createUserWithEmailAndPassword(auth, email, password);

                // Set display name
                await updateProfile(credential.user, { displayName });

                // Send email verification
                await sendEmailVerification(credential.user);

                return { success: true, user: credential.user };
            } catch (err) {
                return { success: false, error: mapFirebaseError(err as AuthError) };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // ── Google Sign-In ──────────────────────────────────────────────────────────
    const loginWithGoogle = useCallback(async (): Promise<FirebaseAuthResult> => {
        setIsLoading(true);
        try {
            const credential = await signInWithPopup(auth, googleProvider);
            return { success: true, user: credential.user };
        } catch (err) {
            const authErr = err as AuthError;
            // User closed the popup — not a real error
            if (
                authErr.code === 'auth/popup-closed-by-user' ||
                authErr.code === 'auth/cancelled-popup-request'
            ) {
                return { success: false, error: '' };
            }
            return { success: false, error: mapFirebaseError(authErr) };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ── Password Reset ──────────────────────────────────────────────────────────
    const sendPasswordReset = useCallback(
        async (email: string): Promise<FirebaseAuthResult> => {
            setIsLoading(true);
            try {
                await sendPasswordResetEmail(auth, email);
                return { success: true };
            } catch (err) {
                return { success: false, error: mapFirebaseError(err as AuthError) };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {
        isLoading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        sendPasswordReset,
    };
};