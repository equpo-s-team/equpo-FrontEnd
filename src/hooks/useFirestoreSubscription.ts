import { useQueryClient } from '@tanstack/react-query';
import { type DocumentData, onSnapshot, type Query, type QuerySnapshot } from 'firebase/firestore';
import { useEffect, useRef } from 'react';

/**
 * Subscribe to a Firestore query and push snapshots into the TanStack Query cache.
 * Unsubscribes automatically when the component unmounts or the Firestore query changes.
 *
 * queryKey and transform are stored in refs so that changing their *references*
 * does not tear down and recreate the onSnapshot listener. Only a change to the
 * actual firestoreQuery object (or queryClient) causes a re-subscription.
 */
export function useFirestoreSubscription<T, TDoc extends DocumentData = DocumentData>(
  queryKey: readonly unknown[],
  firestoreQuery: Query<TDoc, DocumentData> | null,
  transform: (snapshot: QuerySnapshot<TDoc, DocumentData>) => T,
) {
  const queryClient = useQueryClient();

  // Keep latest values in refs so the onSnapshot callback always uses the
  // current queryKey / transform without causing re-subscriptions.
  const queryKeyRef = useRef(queryKey);
  queryKeyRef.current = queryKey;

  const transformRef = useRef(transform);
  transformRef.current = transform;

  useEffect(() => {
    if (!firestoreQuery) return;

    const unsubscribe = onSnapshot(
      firestoreQuery,
      (snapshot) => {
        queryClient.setQueryData(queryKeyRef.current, transformRef.current(snapshot));
      },
      (error) => {
        console.error(
          `Firestore subscription error [${queryKeyRef.current.join('/')}]:`,
          error,
        );
      },
    );

    return () => unsubscribe();
    // Only re-subscribe when the Firestore query or query client actually change.
    // queryKey and transform are read from refs inside the callback.
  }, [queryClient, firestoreQuery]);
}
