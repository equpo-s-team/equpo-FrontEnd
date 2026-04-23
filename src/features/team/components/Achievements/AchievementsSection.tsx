import { AchievementBadge } from '@/features/team/components/Achievements/AchievementBadge.tsx';

import { type Achievement } from '../../types/';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {

  const unlocked = achievements.filter((a) => !!a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);
  const sorted = [...unlocked, ...locked];

  if (achievements.length === 0) return null;

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-full justify-between">
          <h2
            className="text-md font-bold text-grey-700"
            style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}
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
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5 overflow-y-auto">
        {sorted.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
};

export type { Achievement };
