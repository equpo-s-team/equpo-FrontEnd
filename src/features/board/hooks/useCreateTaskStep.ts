import { useMutation } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { TaskStep } from '../types/taskSchema';

type Variables = { teamId: string; taskId: string; step: string };

export function useCreateTaskStep() {
  return useMutation<{ step: TaskStep }, Error, Variables>({
    mutationFn: ({ teamId, taskId, step }) => tasksApi.createStep(teamId, taskId, { step }),
  });
}
