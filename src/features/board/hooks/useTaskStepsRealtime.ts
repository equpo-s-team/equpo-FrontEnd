import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { useEffect, useRef } from 'react';

import { db } from '@/firebase';

import type { FirestoreStepsMap, TaskStep } from '../types/taskSchema';

function toIso(v: { toDate: () => Date } | string | null | undefined): string {
  if (!v) return new Date().toISOString();
  if (typeof v === 'string') return v;
  return (v as { toDate: () => Date }).toDate().toISOString();
}

export function useTaskStepsRealtime(teamId: string, taskId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['task', teamId, taskId, 'steps'] as const;
  const unsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    if (!teamId || !taskId) return;
    unsubRef.current?.();

    unsubRef.current = onSnapshot(
      doc(db, teamId, taskId),
      (snapshot) => {
        const stepsMap =
          (snapshot.data() as { steps?: FirestoreStepsMap } | undefined)?.steps ?? {};
        const steps: TaskStep[] = Object.values(stepsMap)
          .map((s) => ({
            taskId,
            step: s.step,
            isDone: s.isDone,
            position: s.position,
            createdAt: toIso(s.createdAt),
            updatedAt: toIso(s.updatedAt),
          }))
          .sort((a, b) => a.position - b.position);
        queryClient.setQueryData(queryKey, { steps });
      },
      (error) => console.error('[useTaskStepsRealtime]', error),
    );

    return () => {
      unsubRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, taskId]);

  return useQuery<{ steps: TaskStep[] }>({
    queryKey,
    queryFn: () => (queryClient.getQueryData(queryKey) as { steps: TaskStep[] }) ?? { steps: [] },
    enabled: Boolean(teamId && taskId),
    staleTime: Infinity,
  });
}
