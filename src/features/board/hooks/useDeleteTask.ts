import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasksApi';

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, taskId }: { teamId: string; taskId: string }) =>
      tasksApi.delete(teamId, taskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.teamId] });
    },
  });
}
