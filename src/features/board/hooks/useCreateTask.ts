import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { CreateTaskPayload, TeamTask } from '../types/taskSchema';

type CreateTaskVariables = {
  teamId: string;
  payload: CreateTaskPayload;
};

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<{ task: TeamTask }, Error, CreateTaskVariables>({
    mutationFn: ({ teamId, payload }) => tasksApi.create(teamId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', variables.teamId] });
    },
  });
}
