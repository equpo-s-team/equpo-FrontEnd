import { useQueryClient } from '@tanstack/react-query';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect } from 'react';

import { db } from '@/firebase';

export function useReportsTaskSync(teamId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!teamId) return;

    const firestoreQuery = query(collection(db, teamId));
    let isInitial = true;

    const unsubscribe = onSnapshot(
      firestoreQuery,
      () => {
        if (isInitial) {
          isInitial = false;
          return;
        }

        // On subsequent updates, invalidate the reports cache
        void queryClient.invalidateQueries({ queryKey: ['reports', teamId] });
      },
      (error) => {
        console.error(`Reports tasks sync error [teamId: ${teamId}]:`, error);
      }
    );

    return () => unsubscribe();
  }, [teamId, queryClient]);
}
