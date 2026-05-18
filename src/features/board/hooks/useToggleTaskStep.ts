import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toastError } from '@/components/ui/toast.ts';
import { useAchievementPopup } from '@/context/AchievementContext';
import { useAudio } from '@/context/AudioContext';
import { useAuth } from '@/context/AuthContext';
import type { Achievement, XpRewardRecipient } from '@/features/team/types/achievementTypes';

import { tasksApi } from '../api/tasksApi';
import type { TaskStep } from '../types/taskSchema';

type Variables = { teamId: string; taskId: string; stepId: string; isDone: boolean };
type Context = { previous: { steps: TaskStep[] } | undefined };

export function useToggleTaskStep() {
  const queryClient = useQueryClient();
  const { user, updateUserData } = useAuth();
  const { playSoundEffect } = useAudio();
  const { showAchievements } = useAchievementPopup();

  return useMutation<Awaited<ReturnType<typeof tasksApi.toggleStep>>, Error, Variables, Context>({
    mutationFn: ({ teamId, taskId, stepId, isDone }) =>
      tasksApi.toggleStep(teamId, taskId, stepId, { isDone }),
    onMutate: async ({ teamId, taskId, stepId, isDone }) => {
      const key = ['task', teamId, taskId, 'steps'] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<{ steps: TaskStep[] }>(key);
      queryClient.setQueryData(key, (old: { steps: TaskStep[] } | undefined) => ({
        steps: (old?.steps ?? []).map((s) =>
          s.step === stepId ? { ...s, isDone, updatedAt: new Date().toISOString() } : s,
        ),
      }));
      return { previous };
    },
    onSuccess: async (data, variables) => {
      playSoundEffect('/sounds/task-updated.mp3');

      await queryClient.invalidateQueries({ queryKey: ['tasks', variables.teamId] });
      await queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });

      if (data.unlockedAchievements && data.unlockedAchievements.length > 0) {
        await queryClient.invalidateQueries({ queryKey: ['achievements'] });
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
    onError: (_err, { teamId, taskId }, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['task', teamId, taskId, 'steps'], ctx.previous);
      }
      toastError('No se pudo actualizar el paso');
    },
  });
}
