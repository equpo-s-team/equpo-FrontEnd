import React, { createContext, useCallback, useContext, useState } from 'react';

import type { Achievement } from '@/features/team/types/achievementTypes';

import { AchievementPopup } from '@/features/team/components/Achievements/AchievementPopup';

interface AchievementContextValue {
  showAchievement: (achievement: Achievement) => void;
  showAchievements: (achievements: Achievement[]) => void;
}

const AchievementContext = createContext<AchievementContextValue | null>(null);

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [current, setCurrent] = useState<Achievement | null>(null);

  const processNext = useCallback((remaining: Achievement[]) => {
    if (remaining.length === 0) {
      setCurrent(null);
      return;
    }
    const [next, ...rest] = remaining;
    setCurrent(next);
    setQueue(rest);
  }, []);

  const showAchievement = useCallback(
    (achievement: Achievement) => {
      if (!current) {
        setCurrent(achievement);
      } else {
        setQueue((prev) => [...prev, achievement]);
      }
    },
    [current],
  );

  const showAchievements = useCallback(
    (achievements: Achievement[]) => {
      if (achievements.length === 0) return;

      if (!current) {
        const [first, ...rest] = achievements;
        setCurrent(first);
        setQueue((prev) => [...prev, ...rest]);
      } else {
        setQueue((prev) => [...prev, ...achievements]);
      }
    },
    [current],
  );

  const handleDismiss = useCallback(() => {
    processNext(queue);
  }, [queue, processNext]);

  return (
    <AchievementContext.Provider value={{ showAchievement, showAchievements }}>
      {children}
      {current && <AchievementPopup achievement={current} onDismiss={handleDismiss} />}
    </AchievementContext.Provider>
  );
}

export function useAchievementPopup(): AchievementContextValue {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error('useAchievementPopup must be used inside AchievementProvider');
  return ctx;
}
