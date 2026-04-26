import { useMutation } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';

type Variables = { teamId: string; taskId: string; commentaryId: string };

export function useDeleteTaskCommentary() {
  return useMutation<{ deletedCommentaryId: string }, Error, Variables>({
    mutationFn: ({ teamId, taskId, commentaryId }) =>
      tasksApi.deleteCommentary(teamId, taskId, commentaryId),
  });
}
