import { useMutation } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { TaskCommentary } from '../types/taskSchema';

type Variables = { teamId: string; taskId: string; commentaryId: string; commentary: string };

export function useUpdateTaskCommentary() {
  return useMutation<{ commentary: TaskCommentary }, Error, Variables>({
    mutationFn: ({ teamId, taskId, commentaryId, commentary }) =>
      tasksApi.updateCommentary(teamId, taskId, commentaryId, { commentary }),
  });
}
