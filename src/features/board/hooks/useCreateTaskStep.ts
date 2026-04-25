import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { TaskStep } from '../types/taskSchema';

type Variables = { teamId: string; taskId: string; step: string };
type Context = { previous: { steps: TaskStep[] } | undefined };

export function useCreateTaskStep() {
  const queryClient = useQueryClient();
  return useMutation<{ step: TaskStep }, Error, Variables, Context>({
    mutationFn: ({ teamId, taskId, step }) => tasksApi.createStep(teamId, taskId, { step }),
    onMutate: async ({ teamId, taskId, step }) => {
      const key = ['task', teamId, taskId, 'steps'] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<{ steps: TaskStep[] }>(key);
      const now = new Date().toISOString();
      const optimisticStep: TaskStep = {
        taskId,
        step,
        isDone: false,
        position: (previous?.steps.length ?? 0) + 1,
        createdAt: now,
        updatedAt: now,
      };
      queryClient.setQueryData(key, (old: { steps: TaskStep[] } | undefined) => ({
        steps: [...(old?.steps ?? []), optimisticStep],
      }));
      return { previous };
    },
    onError: (_err, { teamId, taskId }, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['task', teamId, taskId, 'steps'], ctx.previous);
      }
    },
  });
}
