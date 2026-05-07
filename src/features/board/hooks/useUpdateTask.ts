import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAchievementPopup } from '@/context/AchievementContext';
import { useAudio } from '@/context/AudioContext';
import { useAuth } from '@/context/AuthContext';
import type { TeamTask, UpdateTaskPayload } from '@/features/board';
import type {
  Achievement,
  XpRewardData,
  XpRewardRecipient,
} from '@/features/team/types/achievementTypes';

import { tasksApi } from '../api/tasksApi';

type UpdateTaskVariables = {
  teamId: string;
  taskId: string;
  payload: UpdateTaskPayload;
};

interface TaskUpdateResponse {
  task: TeamTask;
  xpReward?: XpRewardData;
  unlockedAchievements?: Array<{
    id: string;
    name: string;
    description: string | null;
    iconUrl: string | null;
    unlockedAt: string;
  }>;
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { playSoundEffect } = useAudio();
  const { showAchievements } = useAchievementPopup();
  const { user, updateUserData } = useAuth();

  return useMutation<TaskUpdateResponse, Error, UpdateTaskVariables>({
    mutationFn: ({ teamId, taskId, payload }) => tasksApi.update(teamId, taskId, payload),
    onSuccess: async (data, variables) => {
      playSoundEffect('/sounds/task-updated.mp3');
      await queryClient.invalidateQueries({ queryKey: ['tasks', variables.teamId] });
      await queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });

      // Invalidate achievements cache to reflect newly unlocked achievements
      if (data.unlockedAchievements && data.unlockedAchievements.length > 0) {
        await queryClient.invalidateQueries({ queryKey: ['achievements'] });

        // Show achievement popup(s)
        const mapped: Achievement[] = data.unlockedAchievements.map((a) => ({
          id: a.id,
          name: a.name,
          icon: a.name,
          iconUrl: a.iconUrl,
          description: a.description,
          unlockedAt: a.unlockedAt,
        }));
        showAchievements(mapped);
      }

      if (data.xpReward) {
        await queryClient.invalidateQueries({ queryKey: ['teams'] });
        await queryClient.invalidateQueries({
          queryKey: ['team', variables.teamId, 'rewards'],
        });

        // Only update the local auth profile if the current user was a reward recipient.
        const myEntry: XpRewardRecipient | undefined = data.xpReward.recipients?.find(
          (r) => r.uid === user?.uid,
        );

        if (myEntry) {
          updateUserData({
            experiencePoints: myEntry.newXp,
            level: myEntry.newLevel,
            virtualCurrency: myEntry.newUserVirtualCurrency,
          });
        }
      }
    },
  });
}
