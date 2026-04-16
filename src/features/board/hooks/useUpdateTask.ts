import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TeamTask, UpdateTaskPayload } from '@/features/board';

import { tasksApi } from '../api/tasksApi';

type UpdateTaskVariables = {
  teamId: string;
  taskId: string;
  payload: UpdateTaskPayload;
};

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation<{ task: TeamTask }, Error, UpdateTaskVariables>({
    mutationFn: ({ teamId, taskId, payload }) => tasksApi.update(teamId, taskId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', variables.teamId] });
      await queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
    },
  });
}
