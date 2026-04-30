import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

import type { User } from 'firebase/auth';
import { auth } from '@/firebase.ts';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuth(user !== null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, isAuth, loading };
}
