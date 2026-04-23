import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { useEffect, useRef } from 'react';

import { db } from '@/firebase';
import type { FirestoreCommentariesMap, TaskCommentary } from '../types/taskSchema';

function toIso(v: { toDate: () => Date } | string | null | undefined): string {
  if (!v) return new Date().toISOString();
  if (typeof v === 'string') return v;
  return (v as { toDate: () => Date }).toDate().toISOString();
}

export function useTaskCommentariesRealtime(teamId: string, taskId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['task', teamId, taskId, 'commentaries'] as const;
  const unsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    if (!teamId || !taskId) return;
    unsubRef.current?.();

    unsubRef.current = onSnapshot(
      doc(db, teamId, taskId),
      (snapshot) => {
        const map =
          (snapshot.data() as { commentaries?: FirestoreCommentariesMap } | undefined)
            ?.commentaries ?? {};
        const commentaries: TaskCommentary[] = Object.values(map)
          .map((c) => ({
            taskId,
            userUid: c.userUid,
            displayName: c.displayName ?? null,
            photoURL: c.photoURL ?? null,
            commentary: c.commentary,
            createdAt: toIso(c.createdAt),
            updatedAt: toIso(c.updatedAt),
          }))
          .sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        queryClient.setQueryData(queryKey, { commentaries });
      },
      (error) => console.error('[useTaskCommentariesRealtime]', error),
    );

    return () => {
      unsubRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, taskId]);

  return useQuery<{ commentaries: TaskCommentary[] }>({
    queryKey,
    queryFn: () =>
      (queryClient.getQueryData(queryKey) as { commentaries: TaskCommentary[] }) ?? {
        commentaries: [],
      },
    enabled: Boolean(teamId && taskId),
    staleTime: Infinity,
  });
}
