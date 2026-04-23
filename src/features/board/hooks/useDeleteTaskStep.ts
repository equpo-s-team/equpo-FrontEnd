import { useMutation } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';

type Variables = { teamId: string; taskId: string; stepId: string };

export function useDeleteTaskStep() {
  return useMutation<{ deletedStepId: string }, Error, Variables>({
    mutationFn: ({ teamId, taskId, stepId }) => tasksApi.deleteStep(teamId, taskId, stepId),
  });
}
