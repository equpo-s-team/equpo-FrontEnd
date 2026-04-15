import React, {useState} from 'react';

import {AchievementBadge} from "@/features/team/components/Achievements/AchievementBadge.tsx";

import {type Achievement} from "../../types/teamsTypes.ts";


interface AchievementsSectionProps {
  achievements: Achievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({achievements}) => {
  const [showAll, setShowAll] = useState(false);

  const unlocked = achievements.filter((a) => !!a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);
  const sorted = [...unlocked, ...locked];

  const visible = showAll ? sorted : sorted.slice(0, 8);
  const hasMore = sorted.length > 8;

  if (achievements.length === 0) return null;

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-full justify-between">
          <h2
            className="text-md font-bold text-grey-700"
            style={{fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em'}}
          >
            Logros
          </h2>
          <span
            className="text-sm font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(96,175,255,0.1)',
              color: '#60AFFF',
              border: '1px solid rgba(96,175,255,0.2)',
            }}
          >
            {unlocked.length}/{achievements.length}
          </span>
        </div>

        {hasMore && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-[11px] font-semibold text-grey-400 hover:text-grey-700 transition-colors"
          >
            {showAll ? 'Ver menos' : `Ver todos (${sorted.length})`}
          </button>
        )}
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-3 gap-2">
        {visible.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement}/>
        ))}
      </div>
    </div>
  );
};

export type {Achievement};
