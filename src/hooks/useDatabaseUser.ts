import log from 'loglevel';
import { useCallback, useState } from 'react';

import {
  createUser as createUserFn,
  type CreateUserVariables,
  getUser as getUserFn,
  touchUserLastActive as touchUserLastActiveFn,
} from '@/dataconnect-generated';

export interface DatabaseUser {
  uid: string;
  displayName: string;
  level: number;
  experiencePoints: number;
  virtualCurrency: number;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  photoURL?: string | null;
}

export const useDatabaseUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Create current auth user in database
  const createDatabaseUser = useCallback(
    async (
      displayName: string,
      photoURL?: string | null,
    ): Promise<{ success: boolean; error?: string; user?: DatabaseUser }> => {
      setIsLoading(true);
      try {
        const userVars: CreateUserVariables = {
          displayName,
          photoURL: photoURL ?? null,
        };

        await createUserFn(userVars);

        // Fetch current auth user after upsert (bypass cache to avoid cross-account leaks)
        const userResult = await getUserFn({ fetchPolicy: 'SERVER_ONLY' });
        const user = userResult.data?.users?.[0] as DatabaseUser | undefined;

        return {
          success: true,
          user,
        };
      } catch (err) {
        log.error('Error creating database user:', err);
        return { success: false, error: 'Failed to create user in database' };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Get current auth user from database
  const getDatabaseUser = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
    user?: DatabaseUser;
  }> => {
    setIsLoading(true);
    try {
      const result = await getUserFn({ fetchPolicy: 'SERVER_ONLY' });
      const user = result.data?.users?.[0] as DatabaseUser | undefined;

      if (user) {
        return {
          success: true,
          user,
        };
      }

      return { success: false, error: 'User not found' };
    } catch (err) {
      log.error('Error getting database user:', err);
      return { success: false, error: 'Failed to get user from database' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update lastActive/updatedAt for current auth user using server time.
  const touchUserLastActive = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    setIsLoading(true);
    try {
      await touchUserLastActiveFn();
      return { success: true };
    } catch (err) {
      log.error('Error touching user lastActive:', err);
      return { success: false, error: 'Failed to update user lastActive' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    createDatabaseUser,
    getDatabaseUser,
    touchUserLastActive,
  };
};
