import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { UpdateTaskPayload } from '../types/tasks';

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
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', variables.teamId] });
      await queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
    },
  });
}
