import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TeamTask, UpdateTaskPayload } from '@/features/board';

import { tasksApi } from '../api/tasksApi';
import { useAudio } from '@/context/AudioContext';

type UpdateTaskVariables = {
  teamId: string;
  taskId: string;
  payload: UpdateTaskPayload;
};

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { playSoundEffect } = useAudio();

  return useMutation<{ task: TeamTask }, Error, UpdateTaskVariables>({
    mutationFn: ({ teamId, taskId, payload }) => tasksApi.update(teamId, taskId, payload),
    onSuccess: async (_, variables) => {
      playSoundEffect('/sounds/task-updated.mp3');
      await queryClient.invalidateQueries({ queryKey: ['tasks', variables.teamId] });
      await queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
    },
  });
}
