import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toastError } from '@/lib/toast';

import { tasksApi } from '../api/tasksApi';
import type { TaskStep } from '../types/taskSchema';

type Variables = { teamId: string; taskId: string; stepId: string; isDone: boolean };
type Context = { previous: { steps: TaskStep[] } | undefined };

export function useToggleTaskStep() {
  const queryClient = useQueryClient();
  return useMutation<{ step: TaskStep; newStatus: string }, Error, Variables, Context>({
    mutationFn: ({ teamId, taskId, stepId, isDone }) =>
      tasksApi.toggleStep(teamId, taskId, stepId, { isDone }),
    onMutate: async ({ teamId, taskId, stepId, isDone }) => {
      const key = ['task', teamId, taskId, 'steps'] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<{ steps: TaskStep[] }>(key);
      queryClient.setQueryData(key, (old: { steps: TaskStep[] } | undefined) => ({
        steps: (old?.steps ?? []).map((s) =>
          s.step === stepId ? { ...s, isDone, updatedAt: new Date().toISOString() } : s,
        ),
      }));
      return { previous };
    },
    onError: (_err, { teamId, taskId }, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['task', teamId, taskId, 'steps'], ctx.previous);
      }
      toastError('No se pudo actualizar el paso');
    },
  });
}
