import React, { useMemo } from 'react';
import type { Team } from '@/features/team/types/teamsTypes.ts';

interface TeamCardProps {
  team: Team;
  onEnter: (id: string) => void;
  onEdit: (id: string) => void;
}

const COLOR_PALETTE = [
  { gradient: 'linear-gradient(135deg, #60AFFF 0%, #86F0FD 100%)', glow: 'rgba(96,175,255,0.18)', border: 'rgba(96,175,255,0.3)', dot: '#60AFFF' },
  { gradient: 'linear-gradient(135deg, #9b7fe1 0%, #5961F9 100%)', glow: 'rgba(155,127,225,0.18)', border: 'rgba(155,127,225,0.3)', dot: '#9b7fe1' },
  { gradient: 'linear-gradient(135deg, #9CEDC1 0%, #CEFB7C 100%)', glow: 'rgba(156,237,193,0.18)', border: 'rgba(156,237,193,0.3)', dot: '#9CEDC1' },
  { gradient: 'linear-gradient(135deg, #F65A70 0%, #FFAF93 100%)', glow: 'rgba(246,90,112,0.18)', border: 'rgba(246,90,112,0.3)', dot: '#F65A70' },
  { gradient: 'linear-gradient(135deg, #FF94AE 0%, #FCE98D 100%)', glow: 'rgba(255,148,174,0.18)', border: 'rgba(255,148,174,0.3)', dot: '#FF94AE' },
];

function hashToIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % COLOR_PALETTE.length;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onEnter, onEdit }) => {
  const cfg = useMemo(() => COLOR_PALETTE[hashToIndex(team.id)], [team.id]);

  return (
    <div
      className="group relative rounded-2xl p-[1px] transition-all duration-300"
      style={{
        background: cfg.border,
        boxShadow: `0 4px 24px ${cfg.glow}, 0 1px 4px rgba(0,0,0,0.04)`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px ${cfg.glow.replace('0.18', '0.38')}, 0 2px 8px rgba(0,0,0,0.06)`;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px ${cfg.glow}, 0 1px 4px rgba(0,0,0,0.04)`;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Glass inner */}
      <div className="rounded-2xl bg-white/80 backdrop-blur-md p-5 flex flex-col gap-4" style={{ backdropFilter: 'blur(16px)' }}>

        {/* Top row: name + currency badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Color indicator */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ background: cfg.gradient, boxShadow: `0 4px 14px ${cfg.glow.replace('0.18', '0.5')}` }}
            >
              {team.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-grey-800 text-sm leading-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {team.name}
              </h3>
              <p className="text-[11px] text-grey-400 mt-0.5">
                Desde {new Date(team.createdAt).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Virtual currency badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
            style={{ background: cfg.glow.replace('0.18', '0.1'), border: `1px solid ${cfg.border}` }}
          >
            <span className="text-sm" role="img" aria-label="moneda">💰</span>
            <span className="text-xs font-bold" style={{ color: cfg.dot }}>
              {team.virtualCurrency.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-grey-500 leading-relaxed line-clamp-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {team.description || 'Sin descripción'}
        </p>

        {/* Members row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {team.members.slice(0, 4).map((m, i) => (
                <div
                  key={m.userUid}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white"
                  style={{ background: cfg.gradient, zIndex: 10 - i }}
                  title={m.userUid}
                >
                  {m.userUid.substring(0, 2).toUpperCase()}
                </div>
              ))}
              {team.members.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-grey-100 border-2 border-white flex items-center justify-center text-[10px] text-grey-500 font-semibold">
                  +{team.members.length - 4}
                </div>
              )}
            </div>
            <span className="text-[11px] text-grey-400">{team.members.length} miembros</span>
          </div>

          {/* Leader indicator */}
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }} />
            <span className="text-[11px] font-medium" style={{ color: cfg.dot }}>
              {team.members.length >= 5 ? 'Grande' : team.members.length >= 3 ? 'Mediano' : 'Pequeño'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1 border-t border-grey-100">
          <button
            onClick={() => onEnter(team.id)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: cfg.gradient, boxShadow: `0 4px 12px ${cfg.glow.replace('0.18', '0.4')}` }}
          >
            Entrar al equipo →
          </button>
          <button
            onClick={() => onEdit(team.id)}
            className="px-3 py-2 rounded-xl text-xs font-medium text-grey-500 bg-grey-50 hover:bg-grey-100 transition-colors border border-grey-200"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};
