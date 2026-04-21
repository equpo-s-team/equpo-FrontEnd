import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import type { CreateTaskPayload, TeamTask } from '../types/taskSchema';
import { useAudio } from '@/context/AudioContext';

type CreateTaskVariables = {
  teamId: string;
  payload: CreateTaskPayload;
};

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { playSoundEffect } = useAudio();

  return useMutation<{ task: TeamTask }, Error, CreateTaskVariables>({
    mutationFn: ({ teamId, payload }) => tasksApi.create(teamId, payload),
    onSuccess: async (_, variables) => {
      playSoundEffect('/sounds/task-created.mp3');
      await queryClient.invalidateQueries({ queryKey: ['tasks', variables.teamId] });
    },
  });
}
