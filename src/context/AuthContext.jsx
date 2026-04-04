import { onAuthStateChanged, signOut } from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { getUser } from '@/dataconnect-generated';
import { auth } from '@/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // First set basic Firebase user data
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        // Fetch database user data for current auth user
        const databaseUser = await fetchDatabaseUser();

        if (databaseUser) {
          // Merge Firebase user data with database user data
          setUser({
            ...userData,
            level: databaseUser.level,
            experiencePoints: databaseUser.experiencePoints,
            virtualCurrency: databaseUser.virtualCurrency,
            lastActive: databaseUser.lastActive,
            createdAt: databaseUser.createdAt,
            updatedAt: databaseUser.updatedAt,
          });
        } else {
          // No database user found, return Firebase data only
          setUser(userData);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [fetchDatabaseUser]);

  const value = {
    user,
    isLoading,
    isAuth: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function logOut() {
  return signOut(auth);
}
