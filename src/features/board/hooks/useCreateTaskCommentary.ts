import { useMutation } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { TaskCommentary } from '../types/taskSchema';

type Variables = { teamId: string; taskId: string; commentary: string };

export function useCreateTaskCommentary() {
  return useMutation<{ commentary: TaskCommentary }, Error, Variables>({
    mutationFn: ({ teamId, taskId, commentary }) =>
      tasksApi.createCommentary(teamId, taskId, { commentary }),
  });
}
