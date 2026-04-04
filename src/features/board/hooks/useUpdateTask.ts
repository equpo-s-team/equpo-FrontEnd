import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasksApi';
import type { UpdateTaskPayload } from '../types';

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      taskId,
      payload,
    }: {
      teamId: string;
      taskId: string;
      payload: UpdateTaskPayload;
    }) => tasksApi.update(teamId, taskId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
    },
  });
}
