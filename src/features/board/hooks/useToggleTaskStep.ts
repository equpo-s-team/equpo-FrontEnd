import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { TaskStep } from '../types/taskSchema';

type Variables = { teamId: string; taskId: string; stepId: string; isDone: boolean };

export function useToggleTaskStep() {
  const queryClient = useQueryClient();
  return useMutation<{ step: TaskStep; newStatus: string }, Error, Variables>({
    mutationFn: ({ teamId, taskId, stepId, isDone }) =>
      tasksApi.toggleStep(teamId, taskId, stepId, { isDone }),
    onSuccess: (_, { teamId }) => {
      void queryClient.invalidateQueries({ queryKey: ['tasks', teamId] });
    },
  });
}
