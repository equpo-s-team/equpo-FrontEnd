import { useMutation } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { TaskStep } from '../types/taskSchema';

type Variables = { teamId: string; taskId: string; stepId: string; step: string };

export function useUpdateTaskStep() {
  return useMutation<{ step: TaskStep }, Error, Variables>({
    mutationFn: ({ teamId, taskId, stepId, step }) =>
      tasksApi.updateStep(teamId, taskId, stepId, { step }),
  });
}
