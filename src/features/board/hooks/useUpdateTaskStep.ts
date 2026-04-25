import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { TaskStep } from '../types/taskSchema';

type Variables = { teamId: string; taskId: string; stepId: string; step: string };
type Context = { previous: { steps: TaskStep[] } | undefined };

export function useUpdateTaskStep() {
  const queryClient = useQueryClient();
  return useMutation<{ step: TaskStep }, Error, Variables, Context>({
    mutationFn: ({ teamId, taskId, stepId, step }) =>
      tasksApi.updateStep(teamId, taskId, stepId, { step }),
    onMutate: async ({ teamId, taskId, stepId, step }) => {
      const key = ['task', teamId, taskId, 'steps'] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<{ steps: TaskStep[] }>(key);
      queryClient.setQueryData(key, (old: { steps: TaskStep[] } | undefined) => ({
        steps: (old?.steps ?? []).map((s) =>
          s.step === stepId ? { ...s, step, updatedAt: new Date().toISOString() } : s,
        ),
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
