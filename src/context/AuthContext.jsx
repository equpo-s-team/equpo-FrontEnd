import { onIdTokenChanged, signOut, updateProfile } from 'firebase/auth';
import log from 'loglevel';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { resolveCanonicalAvatarUrl } from '@/components/ui/avatar/avatarStorage';
import { createUser, getUser } from '@/dataconnect-generated';
import { auth } from '@/firebase.ts';
import { queryClient } from '@/lib/queryClient.ts';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDatabaseUser = useCallback(async (userUid) => {
    try {
      const result = await getUser({ fetchPolicy: 'SERVER_ONLY' });
      const user = result.data?.users?.[0];

      // Verificar que el usuario obtenido coincida con el UID actual de Firebase
      if (user && user.uid !== userUid) {
        log.warn('Database user UID mismatch, returning null');
        return null;
      }

      return user ?? null;
    } catch (error) {
      log.error('Error fetching database user:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      // Limpiar estado inmediatamente cuando no hay usuario
      if (!user) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Limpiar estado anterior antes de cargar nuevos datos
      setUser(null);

      // Pequeña pausa para asegurar que el estado se limpie completamente
      await new Promise(resolve => setTimeout(resolve, 100));

      // First set basic Firebase user data
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };

      // Fetch database user data for current auth user
      const databaseUser = await fetchDatabaseUser(user.uid);
      const baseDisplayName = userData.displayName ?? userData.email?.split('@')[0] ?? 'Usuario';
      const sourcePhotoURL = databaseUser?.photoURL ?? userData.photoURL ?? null;

      const canonicalPhotoURL = await resolveCanonicalAvatarUrl(user.uid, sourcePhotoURL);

      if (canonicalPhotoURL && canonicalPhotoURL !== userData.photoURL) {
        try {
          await updateProfile(user, { photoURL: canonicalPhotoURL });
        } catch (error) {
          log.warn('No se pudo actualizar photoURL en Firebase Auth:', error);
        }
      }

      const shouldUpsertDatabaseUser =
        !databaseUser ||
        databaseUser.displayName !== baseDisplayName ||
        (databaseUser.photoURL ?? null) !== canonicalPhotoURL;

      if (shouldUpsertDatabaseUser) {
        try {
          await createUser({
            displayName: baseDisplayName,
            photoURL: canonicalPhotoURL,
          });
        } catch (error) {
          log.warn('No se pudo sincronizar el perfil del usuario en Data Connect:', error);
        }
      }

      // Solo establecer el usuario si coincide con el UID actual de Firebase
      if (auth.currentUser?.uid === user.uid) {
        if (databaseUser) {
          // Merge Firebase user data with database user data
          setUser({
            ...userData,
            photoURL: canonicalPhotoURL,
            level: databaseUser.level,
            experiencePoints: databaseUser.experiencePoints,
            virtualCurrency: databaseUser.virtualCurrency,
            lastActive: databaseUser.lastActive,
            createdAt: databaseUser.createdAt,
            updatedAt: databaseUser.updatedAt,
          });
        } else {
          // No database user found, return Firebase data only
          setUser({
            ...userData,
            displayName: baseDisplayName,
            photoURL: canonicalPhotoURL,
          });
        }
      } else {
        queryClient.clear();
        setUser(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, [fetchDatabaseUser]);

  const updateUserData = useCallback((newData) => {
    setUser((prev) => (prev ? { ...prev, ...newData } : null));
  }, []);

  const value = {
    user,
    isLoading,
    isAuth: !!user,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function logOut() {
  queryClient.clear();
  localStorage.removeItem('userEmail');
  localStorage.removeItem('rememberMe');
  return signOut(auth);
}
