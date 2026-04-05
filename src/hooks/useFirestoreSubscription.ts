import { useQueryClient } from '@tanstack/react-query';
import { type DocumentData, onSnapshot, type Query, type QuerySnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

/**
 * Subscribe to a Firestore query and push snapshots into the TanStack Query cache.
 * Unsubscribes automatically when the component unmounts or the query key changes.
 */
export function useFirestoreSubscription<T, TDoc extends DocumentData = DocumentData>(
  queryKey: readonly unknown[],
  firestoreQuery: Query<TDoc, DocumentData> | null,
  transform: (snapshot: QuerySnapshot<TDoc, DocumentData>) => T,
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!firestoreQuery) return;

    const unsubscribe = onSnapshot(
      firestoreQuery,
      (snapshot) => {
        // We push the data directly into the React Query cache
        queryClient.setQueryData(queryKey, transform(snapshot));
      },
      (error) => {
        console.error(`Firestore subscription error [${queryKey.join('/')}]:`, error);
      },
    );

    return () => unsubscribe();
  }, [queryClient, firestoreQuery, queryKey, transform]);
}
