import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '../api/tasksApi';
import { useAudio } from '@/context/AudioContext';

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { playSoundEffect } = useAudio();

  return useMutation({
    mutationFn: ({ teamId, taskId }: { teamId: string; taskId: string }) =>
      tasksApi.delete(teamId, taskId),
    onSuccess: async (_, variables) => {
      playSoundEffect('/sounds/task-deleted.mp3');
      await queryClient.invalidateQueries({ queryKey: ['tasks', variables.teamId] });
    },
  });
}
