import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { CreateTaskPayload } from '../types';

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, payload }: { teamId: string; payload: CreateTaskPayload }) =>
      tasksApi.create(teamId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', variables.teamId] });
    },
  });
}
