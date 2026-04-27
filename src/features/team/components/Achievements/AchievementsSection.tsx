import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

import { AchievementBadge } from '@/features/team/components/Achievements/AchievementBadge.tsx';

import { type Achievement } from '../../types/';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  const [isOpen, setIsOpen] = useState(true);

  const unlocked = achievements.filter((a) => !!a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);
  const sorted = [...unlocked, ...locked];

  if (achievements.length === 0) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Section header with toggle button for mobile */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-full justify-between">
          <h2
            className="text-md font-bold text-grey-700"
            style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}
          >
            Logros
          </h2>
          <div className="flex items-center gap-2">
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
            {/* Toggle button only visible on mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex items-center justify-center p-1.5 hover:bg-grey-100 rounded-lg transition-colors"
              aria-label={isOpen ? 'Collapse achievements' : 'Expand achievements'}
            >
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-grey-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-grey-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Badges grid - collapses on mobile, always visible on desktop */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'
        }`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5 overflow-y-auto">
          {sorted.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
};

export type { Achievement };
