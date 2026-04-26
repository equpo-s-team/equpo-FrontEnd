import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { TaskStep } from '../types/taskSchema';

type Variables = { teamId: string; taskId: string; stepId: string };
type Context = { previous: { steps: TaskStep[] } | undefined };

export function useDeleteTaskStep() {
  const queryClient = useQueryClient();
  return useMutation<{ deletedStepId: string }, Error, Variables, Context>({
    mutationFn: ({ teamId, taskId, stepId }) => tasksApi.deleteStep(teamId, taskId, stepId),
    onMutate: async ({ teamId, taskId, stepId }) => {
      const key = ['task', teamId, taskId, 'steps'] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<{ steps: TaskStep[] }>(key);
      queryClient.setQueryData(key, (old: { steps: TaskStep[] } | undefined) => ({
        steps: (old?.steps ?? []).filter((s) => s.step !== stepId),
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
