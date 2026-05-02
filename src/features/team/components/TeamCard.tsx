import { Coins } from 'lucide-react';
import React, { useMemo } from 'react';

import { TeamAvatar } from '@/components/ui/TeamAvatar.tsx';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import type { Team } from '@/features/team/types/teamsTypes.ts';

interface TeamCardProps {
  team: Team;
  onEnter: (id: string) => void;
}

const COLOR_PALETTE = [
  {
    gradient: 'linear-gradient(135deg, #60AFFF 0%, #86F0FD 100%)',
    glow: 'rgba(96,175,255,0.18)',
    border: 'rgba(96,175,255,0.3)',
    dot: '#60AFFF',
  },
  {
    gradient: 'linear-gradient(135deg, #9b7fe1 0%, #5961F9 100%)',
    glow: 'rgba(155,127,225,0.18)',
    border: 'rgba(155,127,225,0.3)',
    dot: '#9b7fe1',
  },
  {
    gradient: 'linear-gradient(135deg, #9CEDC1 0%, #CEFB7C 100%)',
    glow: 'rgba(156,237,193,0.18)',
    border: 'rgba(156,237,193,0.3)',
    dot: '#9CEDC1',
  },
  {
    gradient: 'linear-gradient(135deg, #F65A70 0%, #FFAF93 100%)',
    glow: 'rgba(246,90,112,0.18)',
    border: 'rgba(246,90,112,0.3)',
    dot: '#F65A70',
  },
  {
    gradient: 'linear-gradient(135deg, #FF94AE 0%, #FCE98D 100%)',
    glow: 'rgba(255,148,174,0.18)',
    border: 'rgba(255,148,174,0.3)',
    dot: '#FF94AE',
  },
];

function hashToIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % COLOR_PALETTE.length;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onEnter }) => {
  const cfg = useMemo(() => COLOR_PALETTE[hashToIndex(team.id)], [team.id]);
  const { data: members = [], isLoading: membersLoading } = useTeamMembers(team.id);
  const membersForDisplay = membersLoading || members.length === 0 ? team.members : members;
  const baseCardShadow = '0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)';
  const hoverCardShadow = '0 10px 30px rgba(0,0,0,0.14), 0 3px 10px rgba(0,0,0,0.08)';

  return (
    <div
      role="button"
      className="group relative rounded-2xl p-[1px] transition-all duration-300"
      style={{
        background: cfg.border,
        boxShadow: baseCardShadow,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = hoverCardShadow;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = baseCardShadow;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Glass inner */}
      <div
        className="rounded-2xl bg-white/80 dark:bg-gray-900 backdrop-blur-md p-5 flex flex-col gap-4"
      >
        {/* Top row: name + currency badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Color indicator */}
            <div
              className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center text-white dark:text-gray-100 font-bold text-sm shadow-md"
              style={{
                background: cfg.gradient,
                boxShadow: `0 4px 14px ${cfg.glow.replace('0.18', '0.5')}`,
              }}
            >
              <TeamAvatar
                src={team.photoUrl}
                name={team.name}
                className="w-full h-full"
                fallbackClassName="w-full h-full"
                fallbackStyle={{ background: cfg.gradient }}
              />
            </div>
            <div>
              <h3
                className="font-semibold text-grey-800 dark:text-gray-100 text-sm leading-tight"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {team.name}
              </h3>
              <p className="text-xs text-grey-400 mt-0.5">
                Desde{' '}
                {new Date(team.createdAt).toLocaleDateString('es-CO', {
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Virtual currency badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
            style={{
              background: cfg.glow.replace('0.18', '0.1'),
              border: `1px solid ${cfg.border}`,
            }}
          >
            <Coins className="w-4 h-4 text-white" style={{ color: cfg.dot }} />
            <span className="text-xs font-bold" style={{ color: cfg.dot }}>
              {team.virtualCurrency.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs h-10 text-grey-500 leading-relaxed line-clamp-2">
          {team.description || 'Sin descripción'}
        </p>

        {/* Members row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {membersForDisplay.slice(0, 4).map((m, i) => {
                const memberUid = 'uid' in m ? m.uid : m.userUid;
                const memberName = m.displayName ?? memberUid;
                const initial = memberName.substring(0, 2).toUpperCase();
                return (
                  <div
                    key={memberUid}
                    className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                    style={{ zIndex: 10 - i }}
                    title={memberName}
                  >
                    <UserAvatar
                      src={m.photoUrl}
                      alt={memberName}
                      initials={initial}
                      className="w-full h-full"
                      fallbackClassName="text-white text-xs"
                      fallbackStyle={{ background: cfg.gradient }}
                    />
                  </div>
                );
              })}
              {membersForDisplay.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-grey-100 border-2 border-white flex items-center justify-center text-xs text-grey-500 font-semibold">
                  +{membersForDisplay.length - 4}
                </div>
              )}
            </div>
            <span className="text-xs text-grey-400">{membersForDisplay.length} miembros</span>
          </div>

          {/* Leader indicator */}
          <div className="flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }}
            />
            <span className="text-xs font-medium" style={{ color: cfg.dot }}>
              {membersForDisplay.length >= 5
                ? 'Grande'
                : membersForDisplay.length >= 3
                  ? 'Mediano'
                  : 'Pequeño'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1 border-t border-grey-100 dark:border-gray-700">
          <button
            onClick={() => onEnter(team.id)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: cfg.gradient,
              boxShadow: `0 4px 12px ${cfg.glow.replace('0.18', '0.4')}`,
            }}
          >
            Entrar al equipo →
          </button>
        </div>
      </div>
    </div>
  );
};
