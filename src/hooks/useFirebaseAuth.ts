import {
  type AuthError,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type UserCredential,
} from 'firebase/auth';
import { useCallback, useState } from 'react';

import { auth } from '@/firebase';
import { resolveCanonicalAvatarUrl } from '@/lib/utils/avatar/avatarStorage';

import { useDatabaseUser } from './useDatabaseUser';

export interface FirebaseAuthResult {
  success: boolean;
  error?: string;
  user?: UserCredential['user'];
  photoURL?: string;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  access_type: 'offline',
  include_granted_scopes: 'true',
});

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
  const { createDatabaseUser, touchUserLastActive } = useDatabaseUser();

  // ── Email / Password Login ──────────────────────────────────────────────────
  const loginWithEmail = useCallback(
    async (email: string, password: string): Promise<FirebaseAuthResult> => {
      setIsLoading(true);
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const displayName =
          credential.user.displayName ?? credential.user.email?.split('@')[0] ?? 'Usuario';
        const canonicalPhotoURL = await resolveCanonicalAvatarUrl(
          credential.user.uid,
          credential.user.photoURL,
        );

        if (canonicalPhotoURL && canonicalPhotoURL !== credential.user.photoURL) {
          await updateProfile(credential.user, { photoURL: canonicalPhotoURL });
        }

        // Upsert current profile shape before touching lastActive.
        await createDatabaseUser(displayName, canonicalPhotoURL);
        await touchUserLastActive();

        return {
          success: true,
          user: credential.user,
          photoURL: canonicalPhotoURL ?? undefined,
        };
      } catch (err) {
        return { success: false, error: mapFirebaseError(err as AuthError) };
      } finally {
        setIsLoading(false);
      }
    },
    [createDatabaseUser, touchUserLastActive],
  );

  // ── Email / Password Signup ─────────────────────────────────────────────────
  const signupWithEmail = useCallback(
    async (email: string, password: string, displayName: string): Promise<FirebaseAuthResult> => {
      setIsLoading(true);
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);

        // Set display name
        await updateProfile(credential.user, { displayName });

        // Send email verification
        await sendEmailVerification(credential.user);

        // Create user in Data Connect using current auth.uid context.
        await createDatabaseUser(displayName, undefined);

        return {
          success: true,
          user: credential.user,
          photoURL: credential.user.photoURL ?? undefined,
        };
      } catch (err) {
        return { success: false, error: mapFirebaseError(err as AuthError) };
      } finally {
        setIsLoading(false);
      }
    },
    [createDatabaseUser],
  );

  // ── Google Sign-In ──────────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async (): Promise<FirebaseAuthResult> => {
    setIsLoading(true);
    try {
      // Limpiar caché de autenticación para evitar el bug de múltiples cuentas
      await auth.signOut();

      // Crear un nuevo provider para asegurar parámetros frescos
      const freshProvider = new GoogleAuthProvider();
      freshProvider.setCustomParameters({
        prompt: 'select_account',
        access_type: 'offline',
        include_granted_scopes: 'true',
      });

      const credential = await signInWithPopup(auth, freshProvider);

      const displayName =
        credential.user.displayName ?? credential.user.email?.split('@')[0] ?? 'Usuario';
      const canonicalPhotoURL = await resolveCanonicalAvatarUrl(
        credential.user.uid,
        credential.user.photoURL,
      );

      if (canonicalPhotoURL && canonicalPhotoURL !== credential.user.photoURL) {
        await updateProfile(credential.user, { photoURL: canonicalPhotoURL });
      }

      // Ensure database user exists and always touch login time.
      await createDatabaseUser(displayName, canonicalPhotoURL);
      await touchUserLastActive();

      return {
        success: true,
        user: credential.user,
        photoURL: canonicalPhotoURL ?? undefined,
      };
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
  }, [createDatabaseUser, touchUserLastActive]);

  // ── Password Reset ──────────────────────────────────────────────────────────
  const sendPasswordReset = useCallback(async (email: string): Promise<FirebaseAuthResult> => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      return { success: false, error: mapFirebaseError(err as AuthError) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    sendPasswordReset,
  };
};
