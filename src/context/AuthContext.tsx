import { onIdTokenChanged, signOut, updateProfile } from 'firebase/auth';
import log from 'loglevel';
import { createContext, type ReactNode,useCallback, useContext, useEffect, useState } from 'react';

import { resolveCanonicalAvatarUrl } from '@/components/ui/avatar/avatarStorage';
import { createUser, getUser } from '@/dataconnect-generated';
import { auth } from '@/firebase.ts';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  level?: number;
  experiencePoints?: number;
  virtualCurrency?: number;
  lastActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuth: boolean;
  updateUserData: (newData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDatabaseUser = useCallback(async () => {
    try {
      const result = await getUser();
      return result.data?.users?.[0] ?? null;
    } catch (error) {
      log.error('Error fetching database user:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        const databaseUser = await fetchDatabaseUser();
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

        if (databaseUser) {
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
          setUser({
            ...userData,
            displayName: baseDisplayName,
            photoURL: canonicalPhotoURL,
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [fetchDatabaseUser]);

  const updateUserData = useCallback((newData: Partial<AuthUser>) => {
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

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function logOut() {
  return signOut(auth);
}
