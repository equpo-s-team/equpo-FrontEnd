/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import { useRef, useState } from 'react';

/* ─── TYPES ─── */
type Role =
  | 'Frontend Dev'
  | 'Backend Dev'
  | 'UX / Design'
  | 'QA Engineer'
  | 'DevOps'
  | 'Full Stack'
  | 'Product Manager'
  | 'Mobile Dev'
  | 'Data Analyst';

interface Member {
  id: string;
  initials: string;
  name: string;
  role: Role;
  email: string;
  status: 'active' | 'away' | 'offline';
  completionPct: number;
  tasksCompleted: number;
  tasksTotal: number;
  avatarGradient: string;
  avatarGlow: string;
}

interface TeamInfo {
  name: string;
  description: string;
  avatarUrl: string | null;
  avatarGradient: string;
}

/* ─── CONSTANTS ─── */
const AVATAR_GRADIENTS = [
  { gradient: 'linear-gradient(135deg,#60AFFF,#5961F9)', glow: '0 0 16px rgba(96,175,255,0.55)' },
  { gradient: 'linear-gradient(135deg,#9CEDC1,#86F0FD)', glow: '0 0 16px rgba(134,240,253,0.5)' },
  { gradient: 'linear-gradient(135deg,#F65A70,#FF94AE)', glow: '0 0 16px rgba(246,90,112,0.5)' },
  { gradient: 'linear-gradient(135deg,#FF94AE,#FCE98D)', glow: '0 0 16px rgba(255,148,174,0.5)' },
  { gradient: 'linear-gradient(135deg,#9b7fe1,#5961F9)', glow: '0 0 16px rgba(155,127,225,0.55)' },
  { gradient: 'linear-gradient(135deg,#86F0FD,#60AFFF)', glow: '0 0 16px rgba(134,240,253,0.5)' },
  { gradient: 'linear-gradient(135deg,#F65A70,#9b7fe1)', glow: '0 0 16px rgba(246,90,112,0.4)' },
  { gradient: 'linear-gradient(135deg,#9CEDC1,#5961F9)', glow: '0 0 16px rgba(89,97,249,0.4)' },
  { gradient: 'linear-gradient(135deg,#FCE98D,#FF94AE)', glow: '0 0 16px rgba(252,233,141,0.5)' },
];

const ROLES: Role[] = [
  'Frontend Dev',
  'Backend Dev',
  'UX / Design',
  'QA Engineer',
  'DevOps',
  'Full Stack',
  'Product Manager',
  'Mobile Dev',
  'Data Analyst',
];

const STATUS_CONFIG = {
  active: { dot: '#9CEDC1', glow: '0 0 8px rgba(156,237,193,0.9)', label: 'Activo' },
  away: { dot: '#FCE98D', glow: '0 0 8px rgba(252,233,141,0.8)', label: 'Ausente' },
  offline: { dot: '#B0ADA7', glow: 'none', label: 'Inactivo' },
};

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'at',
    initials: 'AT',
    name: 'Andrea Torres',
    role: 'Frontend Dev',
    email: 'andrea@orbit.io',
    status: 'active',
    completionPct: 83,
    tasksCompleted: 24,
    tasksTotal: 29,
    avatarGradient: AVATAR_GRADIENTS[0].gradient,
    avatarGlow: AVATAR_GRADIENTS[0].glow,
  },
  {
    id: 'jr',
    initials: 'JR',
    name: 'Jorge Ramírez',
    role: 'Backend Dev',
    email: 'jorge@orbit.io',
    status: 'active',
    completionPct: 72,
    tasksCompleted: 18,
    tasksTotal: 22,
    avatarGradient: AVATAR_GRADIENTS[1].gradient,
    avatarGlow: AVATAR_GRADIENTS[1].glow,
  },
  {
    id: 'ml',
    initials: 'ML',
    name: 'María López',
    role: 'UX / Design',
    email: 'maria@orbit.io',
    status: 'active',
    completionPct: 91,
    tasksCompleted: 21,
    tasksTotal: 23,
    avatarGradient: AVATAR_GRADIENTS[2].gradient,
    avatarGlow: AVATAR_GRADIENTS[2].glow,
  },
  {
    id: 'cs',
    initials: 'CS',
    name: 'Carlos Soto',
    role: 'QA Engineer',
    email: 'carlos@orbit.io',
    status: 'away',
    completionPct: 92,
    tasksCompleted: 25,
    tasksTotal: 27,
    avatarGradient: AVATAR_GRADIENTS[3].gradient,
    avatarGlow: AVATAR_GRADIENTS[3].glow,
  },
  {
    id: 'lv',
    initials: 'LV',
    name: 'Laura Vargas',
    role: 'DevOps',
    email: 'laura@orbit.io',
    status: 'active',
    completionPct: 68,
    tasksCompleted: 16,
    tasksTotal: 20,
    avatarGradient: AVATAR_GRADIENTS[4].gradient,
    avatarGlow: AVATAR_GRADIENTS[4].glow,
  },
  {
    id: 'dm',
    initials: 'DM',
    name: 'Diego Morales',
    role: 'Full Stack',
    email: 'diego@orbit.io',
    status: 'away',
    completionPct: 73,
    tasksCompleted: 11,
    tasksTotal: 15,
    avatarGradient: AVATAR_GRADIENTS[5].gradient,
    avatarGlow: AVATAR_GRADIENTS[5].glow,
  },
  {
    id: 'rp',
    initials: 'RP',
    name: 'Renata Paredes',
    role: 'Product Manager',
    email: 'renata@orbit.io',
    status: 'active',
    completionPct: 86,
    tasksCompleted: 19,
    tasksTotal: 22,
    avatarGradient: AVATAR_GRADIENTS[6].gradient,
    avatarGlow: AVATAR_GRADIENTS[6].glow,
  },
  {
    id: 'kn',
    initials: 'KN',
    name: 'Kevin Núñez',
    role: 'Mobile Dev',
    email: 'kevin@orbit.io',
    status: 'offline',
    completionPct: 76,
    tasksCompleted: 13,
    tasksTotal: 17,
    avatarGradient: AVATAR_GRADIENTS[7].gradient,
    avatarGlow: AVATAR_GRADIENTS[7].glow,
  },
  {
    id: 'so',
    initials: 'SO',
    name: 'Sofía Ortega',
    role: 'Data Analyst',
    email: 'sofia@orbit.io',
    status: 'active',
    completionPct: 66,
    tasksCompleted: 8,
    tasksTotal: 12,
    avatarGradient: AVATAR_GRADIENTS[8].gradient,
    avatarGlow: AVATAR_GRADIENTS[8].glow,
  },
];

/* ─── SMALL HELPERS ─── */
function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/* ─── NeonBackground ─── */
function NeonBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {[
        { w: 560, h: 560, bg: 'rgba(96,175,255,0.10)', top: -140, left: -80, delay: '0s' },
        { w: 440, h: 440, bg: 'rgba(156,237,193,0.09)', bottom: -60, right: -80, delay: '-3.5s' },
        { w: 360, h: 360, bg: 'rgba(89,97,249,0.06)', top: '38%', left: '52%', delay: '-6s' },
        { w: 280, h: 280, bg: 'rgba(255,148,174,0.07)', bottom: '12%', left: '18%', delay: '-2s' },
      ].map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.w,
            height: o.h,
            background: o.bg,
            filter: 'blur(90px)',
            ...('top' in o && typeof o.top === 'number'
              ? { top: o.top }
              : 'top' in o
                ? { top: o.top }
                : {}),
            ...('bottom' in o && typeof o.bottom === 'number'
              ? { bottom: o.bottom }
              : 'bottom' in o
                ? { bottom: o.bottom }
                : {}),
            ...('left' in o && typeof o.left === 'number'
              ? { left: o.left }
              : 'left' in o
                ? { left: o.left }
                : {}),
            ...('right' in o && typeof o.right === 'number'
              ? { right: o.right }
              : 'right' in o
                ? { right: o.right }
                : {}),
            animation: `floatOrb 9s ease-in-out infinite`,
            animationDelay: o.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Panel wrapper ─── */
function Panel({
  children,
  className = '',
  glowColor = '',
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  return (
    <div
      className={`relative bg-white border border-[#EEECEA] rounded-2xl overflow-hidden ${className}`}
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}
    >
      {glowColor && (
        <div
          className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)` }}
        />
      )}
      {children}
    </div>
  );
}

/* ─── Neon top-bar accent ─── */
function NeonBar({ gradient, shadow }: { gradient: string; shadow: string }) {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
      style={{ background: gradient, boxShadow: shadow }}
    />
  );
}

/* ─── Avatar ─── */
function Avatar({
  member,
  size = 'md',
}: {
  member: Pick<Member, 'initials' | 'avatarGradient' | 'avatarGlow'>;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sz =
    size === 'lg'
      ? 'w-16 h-16 text-base'
      : size === 'sm'
        ? 'w-8 h-8 text-[0.6rem]'
        : 'w-10 h-10 text-[0.72rem]';
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 tracking-wide`}
      style={{ background: member.avatarGradient, boxShadow: member.avatarGlow }}
    >
      {member.initials}
    </div>
  );
}

/* ─── Status dot ─── */
function StatusDot({ status }: { status: Member['status'] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="w-2 h-2 rounded-full flex-shrink-0 inline-block"
      style={{ background: cfg.dot, boxShadow: cfg.glow }}
    />
  );
}

/* ─── Mini stat pill ─── */
function StatPill({
  value,
  label,
  color,
}: {
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-[#FAFAF8] border border-[#EEECEA]">
      <span className="text-sm font-semibold tracking-tight" style={{ color }}>
        {value}
      </span>
      <span className="text-[0.62rem] text-[#908E88] mt-px">{label}</span>
    </div>
  );
}

/* ─── TEAM INFO PANEL ─── */
function TeamInfoPanel({ team, onEdit }: { team: TeamInfo; onEdit: () => void }) {
  const activeCount = INITIAL_MEMBERS.filter((m) => m.status === 'active').length;
  const avgCompletion = Math.round(
    INITIAL_MEMBERS.reduce((a, m) => a + m.completionPct, 0) / INITIAL_MEMBERS.length,
  );

  return (
    <Panel glowColor="rgba(96,175,255,0.09)">
      <NeonBar
        gradient="linear-gradient(90deg,#60AFFF,#5961F9)"
        shadow="0 0 18px rgba(96,175,255,0.7)"
      />
      <div className="p-6 pt-7">
        {/* Avatar + name row */}
        <div className="flex items-start gap-4">
          {/* Team avatar */}
          <div className="relative flex-shrink-0">
            {team.avatarUrl ? (
              <img src={team.avatarUrl} alt="team" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                style={{
                  background: team.avatarGradient,
                  boxShadow: '0 0 20px rgba(96,175,255,0.4)',
                }}
              >
                {team.name.charAt(0)}
              </div>
            )}
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#9CEDC1] border-2 border-white"
              style={{ boxShadow: '0 0 8px rgba(156,237,193,0.9)' }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-[#1A1815] tracking-tight leading-tight truncate">
              {team.name}
            </h2>
            <p className="text-xs text-[#908E88] mt-1 line-clamp-2 leading-relaxed">
              {team.description}
            </p>
          </div>

          <button
            onClick={onEdit}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-[#60AFFF] hover:text-[#5961F9] transition-colors"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          <StatPill value={INITIAL_MEMBERS.length} label="Miembros" color="#5961F9" />
          <StatPill value={activeCount} label="Activos" color="#2e9660" />
          <StatPill value={`${avgCompletion}%`} label="Promedio" color="#60AFFF" />
          <StatPill value="119" label="Tareas" color="#9b7fe1" />
        </div>
      </div>
    </Panel>
  );
}

/* ─── QUICK PERFORMANCE STRIP ─── */
function PerformanceStrip() {
  const stats = [
    {
      label: 'Completadas',
      value: 61,
      total: 119,
      color: '#9CEDC1',
      glow: 'rgba(156,237,193,0.8)',
      pct: Math.round((61 / 119) * 100),
    },
    {
      label: 'En progreso',
      value: 18,
      total: 119,
      color: '#86F0FD',
      glow: 'rgba(134,240,253,0.8)',
      pct: Math.round((18 / 119) * 100),
    },
    {
      label: 'En QA',
      value: 9,
      total: 119,
      color: '#FF94AE',
      glow: 'rgba(255,148,174,0.8)',
      pct: Math.round((9 / 119) * 100),
    },
    {
      label: 'Por hacer',
      value: 24,
      total: 119,
      color: '#9b7fe1',
      glow: 'rgba(155,127,225,0.8)',
      pct: Math.round((24 / 119) * 100),
    },
    {
      label: 'Vencidas',
      value: 7,
      total: 119,
      color: '#F65A70',
      glow: 'rgba(246,90,112,0.8)',
      pct: Math.round((7 / 119) * 100),
    },
  ];

  return (
    <Panel glowColor="rgba(156,237,193,0.08)">
      <NeonBar
        gradient="linear-gradient(90deg,#9CEDC1,#CEFB7C)"
        shadow="0 0 14px rgba(156,237,193,0.7)"
      />
      <div className="p-5 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[0.85rem] font-semibold text-[#35322E] tracking-tight">
            Rendimiento general
          </h3>
          <span className="text-[0.68rem] text-[#908E88]">119 tareas · 30 días</span>
        </div>

        {/* Distribution bar */}
        <div className="flex w-full h-2 rounded-full overflow-hidden gap-0.5 mb-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${s.pct}%`, background: s.color, boxShadow: `0 0 6px ${s.glow}` }}
            />
          ))}
        </div>

        {/* Legend row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: s.color, boxShadow: `0 0 5px ${s.glow}` }}
              />
              <span className="text-[0.68rem] text-[#706E69]">{s.label}</span>
              <span className="text-[0.68rem] font-semibold text-[#35322E]">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ─── MEMBER CARD ─── */
function MemberCard({
  member,
  onEdit,
  onRemove,
}: {
  member: Member;
  onEdit: (m: Member) => void;
  onRemove: (id: string) => void;
}) {
  const statusCfg = STATUS_CONFIG[member.status];

  return (
    <div
      className="group relative bg-white border border-[#EEECEA] rounded-2xl p-4 transition-all duration-200
      hover:border-[rgba(96,175,255,0.35)] hover:shadow-[0_4px_24px_rgba(96,175,255,0.08)]"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}
    >
      {/* Top row: avatar + name + actions */}
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar member={member} />
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
            style={{ background: statusCfg.dot, boxShadow: statusCfg.glow }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[0.85rem] font-semibold text-[#1A1815] leading-tight truncate">
            {member.name}
          </p>
          <p className="text-[0.7rem] text-[#908E88] mt-0.5">{member.role}</p>
          <p className="text-[0.67rem] text-[#B0ADA7] mt-0.5 truncate">{member.email}</p>
        </div>

        {/* Action buttons — visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(member)}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#F5F4F1] hover:bg-[#60AFFF]/10 hover:text-[#60AFFF] text-[#908E88] transition-all"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => onRemove(member.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#F5F4F1] hover:bg-[#F65A70]/10 hover:text-[#F65A70] text-[#908E88] transition-all"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3.5">
        <div className="flex justify-between mb-1.5 text-[0.64rem] text-[#908E88]">
          <span>Completadas</span>
          <span className="font-medium text-[#524F4A]">
            {member.tasksCompleted}/{member.tasksTotal}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#EEECEA] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${member.completionPct}%`,
              background: member.avatarGradient,
              boxShadow: member.avatarGlow,
            }}
          />
        </div>
      </div>

      {/* Status badge */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <StatusDot status={member.status} />
          <span className="text-[0.65rem] text-[#908E88]">{statusCfg.label}</span>
        </div>
        <span
          className="text-[0.7rem] font-semibold"
          style={{ color: member.avatarGradient.includes('#60AFFF') ? '#5961F9' : '#908E88' }}
        >
          {member.completionPct}%
        </span>
      </div>
    </div>
  );
}

/* ─── MEMBER LIST ROW (table view) ─── */
function MemberListRow({
  member,
  onEdit,
  onRemove,
}: {
  member: Member;
  onEdit: (m: Member) => void;
  onRemove: (id: string) => void;
}) {
  const statusCfg = STATUS_CONFIG[member.status];
  return (
    <div
      className="group grid items-center gap-3 py-3 px-4 border-b border-[#F5F4F1] last:border-0
      hover:bg-[#FAFAF8] transition-colors rounded-xl
      grid-cols-[36px_1fr_120px_80px_100px_64px]"
    >
      <Avatar member={member} size="sm" />
      <div className="min-w-0">
        <p className="text-[0.82rem] font-medium text-[#1A1815] truncate">{member.name}</p>
        <p className="text-[0.67rem] text-[#B0ADA7] truncate">{member.email}</p>
      </div>
      <span className="text-[0.72rem] text-[#706E69] truncate">{member.role}</span>
      <div className="flex items-center gap-1.5">
        <StatusDot status={member.status} />
        <span className="text-[0.68rem] text-[#908E88]">{statusCfg.label}</span>
      </div>
      <div>
        <div className="flex justify-between mb-1 text-[0.62rem] text-[#908E88]">
          <span>{member.completionPct}%</span>
        </div>
        <div className="w-full h-1 bg-[#EEECEA] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${member.completionPct}%`, background: member.avatarGradient }}
          />
        </div>
      </div>
      <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(member)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-[#B0ADA7] hover:text-[#60AFFF] hover:bg-[#60AFFF]/10 transition-all"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={() => onRemove(member.id)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-[#B0ADA7] hover:text-[#F65A70] hover:bg-[#F65A70]/10 transition-all"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── EDIT MEMBER MODAL ─── */
function MemberModal({
  member,
  onSave,
  onClose,
}: {
  member: Member | null;
  onSave: (m: Member) => void;
  onClose: () => void;
}) {
  const isNew = !member?.id || member.id === '__new__';
  const [form, setForm] = useState<Member>(
    member ?? {
      id: `m_${Date.now()}`,
      initials: '',
      name: '',
      role: 'Frontend Dev',
      email: '',
      status: 'active',
      completionPct: 0,
      tasksCompleted: 0,
      tasksTotal: 0,
      avatarGradient: AVATAR_GRADIENTS[0].gradient,
      avatarGlow: AVATAR_GRADIENTS[0].glow,
    },
  );

  function updateField<K extends keyof Member>(key: K, val: Member[K]) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if (key === 'name') next.initials = getInitials(val as string);
      return next;
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(26,24,21,0.4)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(96,175,255,0.08)' }}
      >
        {/* Neon top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: 'linear-gradient(90deg,#60AFFF,#9b7fe1)',
            boxShadow: '0 0 18px rgba(96,175,255,0.7)',
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#EEECEA]">
          <div>
            <h3 className="text-[0.95rem] font-semibold text-[#1A1815]">
              {isNew ? 'Agregar miembro' : 'Editar miembro'}
            </h3>
            <p className="text-[0.7rem] text-[#908E88] mt-0.5">
              {isNew
                ? 'Completa la información del nuevo integrante'
                : 'Actualiza los datos del miembro'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#F5F4F1] flex items-center justify-center text-[#908E88] hover:text-[#35322E] transition-colors"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Avatar color picker */}
          <div>
            <label className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#B0ADA7] block mb-2.5">
              Color de avatar
            </label>
            <div className="flex gap-2 flex-wrap">
              {AVATAR_GRADIENTS.map((ag, i) => (
                <button
                  key={i}
                  onClick={() => {
                    updateField('avatarGradient', ag.gradient);
                    updateField('avatarGlow', ag.glow);
                  }}
                  className="w-8 h-8 rounded-full transition-all duration-150 flex-shrink-0"
                  style={{
                    background: ag.gradient,
                    boxShadow: form.avatarGradient === ag.gradient ? ag.glow : 'none',
                    transform: form.avatarGradient === ag.gradient ? 'scale(1.2)' : 'scale(1)',
                    outline:
                      form.avatarGradient === ag.gradient
                        ? '2px solid rgba(96,175,255,0.5)'
                        : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
              {/* Preview */}
              <div
                className="ml-auto flex items-center justify-center w-8 h-8 rounded-full text-[0.65rem] font-bold text-white"
                style={{ background: form.avatarGradient, boxShadow: form.avatarGlow }}
              >
                {form.initials || '?'}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#B0ADA7] block mb-1.5">
              Nombre completo
            </label>
            <input
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ej. Ana García"
              className="w-full px-3 py-2.5 rounded-xl border border-[#E4E2DE] text-[0.82rem] text-[#35322E] bg-[#FAFAF8] outline-none
                focus:border-[rgba(96,175,255,0.5)] focus:shadow-[0_0_0_3px_rgba(96,175,255,0.1)] focus:bg-white transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#B0ADA7] block mb-1.5">
              Email
            </label>
            <input
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              type="email"
              placeholder="ana@orbit.io"
              className="w-full px-3 py-2.5 rounded-xl border border-[#E4E2DE] text-[0.82rem] text-[#35322E] bg-[#FAFAF8] outline-none
                focus:border-[rgba(96,175,255,0.5)] focus:shadow-[0_0_0_3px_rgba(96,175,255,0.1)] focus:bg-white transition-all"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#B0ADA7] block mb-1.5">
              Rol
            </label>
            <select
              value={form.role}
              onChange={(e) => updateField('role', e.target.value as Role)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E4E2DE] text-[0.82rem] text-[#35322E] bg-[#FAFAF8] outline-none
                focus:border-[rgba(96,175,255,0.5)] focus:shadow-[0_0_0_3px_rgba(96,175,255,0.1)] focus:bg-white transition-all appearance-none cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#B0ADA7] block mb-2">
              Estado
            </label>
            <div className="flex gap-2">
              {(['active', 'away', 'offline'] as const).map((s) => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => updateField('status', s)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-[0.72rem] font-medium transition-all
                      ${
                        form.status === s
                          ? 'border-[rgba(96,175,255,0.5)] bg-[rgba(96,175,255,0.06)] text-[#35322E] shadow-[0_0_0_2px_rgba(96,175,255,0.1)]'
                          : 'border-[#E4E2DE] bg-[#FAFAF8] text-[#908E88] hover:bg-white'
                      }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: cfg.dot,
                        boxShadow: form.status === s ? cfg.glow : 'none',
                      }}
                    />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#E4E2DE] text-[0.8rem] text-[#706E69] hover:bg-[#F5F4F1] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (form.name.trim()) onSave(form);
            }}
            disabled={!form.name.trim()}
            className="flex-1 py-2.5 rounded-xl text-[0.8rem] font-medium text-white transition-all disabled:opacity-40
              bg-[#1A1815] hover:shadow-[0_0_20px_rgba(96,175,255,0.3)]"
          >
            {isNew ? 'Agregar miembro' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── EDIT TEAM MODAL ─── */
function TeamModal({
  team,
  onSave,
  onClose,
}: {
  team: TeamInfo;
  onSave: (t: TeamInfo) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(team);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, avatarUrl: ev.target?.result as string }));
    reader.readAsDataURL(file);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(26,24,21,0.4)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.15)' }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: 'linear-gradient(90deg,#9CEDC1,#86F0FD)',
            boxShadow: '0 0 18px rgba(156,237,193,0.7)',
          }}
        />

        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#EEECEA]">
          <div>
            <h3 className="text-[0.95rem] font-semibold text-[#1A1815]">Editar equipo</h3>
            <p className="text-[0.7rem] text-[#908E88] mt-0.5">
              Imagen, nombre y descripción del equipo
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#F5F4F1] flex items-center justify-center text-[#908E88] hover:text-[#35322E] transition-colors"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Image upload */}
          <div>
            <label className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#B0ADA7] block mb-2.5">
              Imagen del equipo
            </label>
            <div className="flex items-center gap-4">
              <div
                className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer group"
                onClick={() => fileRef.current?.click()}
                style={{
                  background: form.avatarUrl ? 'transparent' : form.avatarGradient,
                  boxShadow: '0 0 16px rgba(96,175,255,0.25)',
                }}
              >
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                    {form.name.charAt(0)}
                  </span>
                )}
                <div className="absolute inset-0 bg-[#1A1815]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-[0.75rem] font-medium text-[#60AFFF] hover:text-[#5961F9] transition-colors block mb-1"
                >
                  Subir imagen
                </button>
                {form.avatarUrl && (
                  <button
                    onClick={() => setForm((f) => ({ ...f, avatarUrl: null }))}
                    className="text-[0.7rem] text-[#F65A70] hover:opacity-80 transition-opacity"
                  >
                    Eliminar imagen
                  </button>
                )}
                <p className="text-[0.65rem] text-[#B0ADA7] mt-1">PNG, JPG · máx. 2MB</p>
              </div>
            </div>
          </div>

          {/* Gradient picker (when no image) */}
          {!form.avatarUrl && (
            <div>
              <label className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#B0ADA7] block mb-2">
                Color de fondo
              </label>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_GRADIENTS.map((ag, i) => (
                  <button
                    key={i}
                    onClick={() => setForm((f) => ({ ...f, avatarGradient: ag.gradient }))}
                    className="w-7 h-7 rounded-full transition-all"
                    style={{
                      background: ag.gradient,
                      transform: form.avatarGradient === ag.gradient ? 'scale(1.25)' : 'scale(1)',
                      outline:
                        form.avatarGradient === ag.gradient
                          ? '2px solid rgba(96,175,255,0.5)'
                          : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#B0ADA7] block mb-1.5">
              Nombre del equipo
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E4E2DE] text-[0.82rem] text-[#35322E] bg-[#FAFAF8] outline-none
                focus:border-[rgba(96,175,255,0.5)] focus:shadow-[0_0_0_3px_rgba(96,175,255,0.1)] focus:bg-white transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#B0ADA7] block mb-1.5">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E4E2DE] text-[0.82rem] text-[#35322E] bg-[#FAFAF8] outline-none resize-none
                focus:border-[rgba(96,175,255,0.5)] focus:shadow-[0_0_0_3px_rgba(96,175,255,0.1)] focus:bg-white transition-all leading-relaxed"
            />
          </div>
        </div>

        <div className="flex gap-2.5 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#E4E2DE] text-[0.8rem] text-[#706E69] hover:bg-[#F5F4F1] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (form.name.trim()) onSave(form);
            }}
            className="flex-1 py-2.5 rounded-xl text-[0.8rem] font-medium text-white bg-[#1A1815] hover:shadow-[0_0_20px_rgba(156,237,193,0.3)] transition-all"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── DELETE CONFIRM MODAL ─── */
function DeleteModal({
  name,
  onConfirm,
  onClose,
}: {
  name: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(26,24,21,0.4)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-[rgba(246,90,112,0.1)] flex items-center justify-center mx-auto mb-4">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F65A70"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </div>
        <h3 className="text-[0.9rem] font-semibold text-[#1A1815] mb-1.5">Eliminar miembro</h3>
        <p className="text-[0.78rem] text-[#908E88] mb-5">
          ¿Seguro que quieres eliminar a <strong className="text-[#35322E]">{name}</strong> del
          equipo? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#E4E2DE] text-[0.8rem] text-[#706E69] hover:bg-[#F5F4F1] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-[0.8rem] font-medium text-white bg-[#F65A70] hover:shadow-[0_0_16px_rgba(246,90,112,0.4)] transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── TOAST ─── */
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 bg-[#1A1815] text-white
      px-4 py-3 rounded-2xl shadow-2xl text-[0.8rem] font-medium
      animate-[fadeUp_0.25s_ease_both]"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.06)' }}
      onAnimationEnd={() => setTimeout(onDone, 2200)}
    >
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center bg-[#9CEDC1] flex-shrink-0"
        style={{ boxShadow: '0 0 10px rgba(156,237,193,0.8)' }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1A1815"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {message}
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function AdminEquipo() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [team, setTeam] = useState<TeamInfo>({
    name: 'Orbit Design System',
    description:
      'Equipo multidisciplinario enfocado en producto digital, desarrollo frontend y experiencia de usuario. Iteración continua y entrega rápida.',
    avatarUrl: null,
    avatarGradient: 'linear-gradient(135deg,#60AFFF,#5961F9)',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Member['status']>('all');
  const [filterRole, setFilterRole] = useState<'all' | Role>('all');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const allRoles = Array.from(new Set(members.map((m) => m.role)));

  const filtered = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchRole = filterRole === 'all' || m.role === filterRole;
    return matchSearch && matchStatus && matchRole;
  });

  function showToast(msg: string) {
    setToast(msg);
  }

  function handleSaveMember(m: Member) {
    setMembers((prev) =>
      prev.find((x) => x.id === m.id) ? prev.map((x) => (x.id === m.id ? m : x)) : [...prev, m],
    );
    setShowMemberModal(false);
    setEditingMember(null);
    showToast(
      editingMember?.id && editingMember.id !== '__new__'
        ? `${m.name} actualizado`
        : `${m.name} agregado al equipo`,
    );
  }

  function handleRemove(id: string) {
    const m = members.find((x) => x.id === id);
    if (m) {
      setDeleteTarget(m);
    }
  }

  function confirmRemove() {
    if (!deleteTarget) return;
    setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    showToast(`${deleteTarget.name} eliminado del equipo`);
    setDeleteTarget(null);
  }

  function openNewMember() {
    setEditingMember({
      id: '__new__',
      initials: '',
      name: '',
      role: 'Frontend Dev',
      email: '',
      status: 'active',
      completionPct: 0,
      tasksCompleted: 0,
      tasksTotal: 0,
      avatarGradient: AVATAR_GRADIENTS[0].gradient,
      avatarGlow: AVATAR_GRADIENTS[0].glow,
    });
    setShowMemberModal(true);
  }

  function openEditMember(m: Member) {
    setEditingMember(m);
    setShowMemberModal(true);
  }

  return (
    <div className="relative min-h-screen bg-white font-body overflow-x-hidden">
      <NeonBackground />

      {/* ── HEADER ── */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-5 border-b border-[#EEECEA]">
        <div className="flex items-center gap-2.5 text-[1.05rem] font-semibold tracking-tight text-[#1A1815]">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg,#60AFFF,#5961F9)',
              boxShadow: '0 0 14px rgba(96,175,255,0.85), 0 0 28px rgba(96,175,255,0.35)',
              animation: 'pulseNeon 2.4s ease-in-out infinite',
            }}
          />
          Orbit
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-[0.72rem] font-medium text-[#2e9660]">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#9CEDC1',
                boxShadow: '0 0 10px rgba(156,237,193,1)',
                animation: 'pulseNeon 1.8s ease-in-out infinite',
              }}
            />
            En vivo
          </span>
          <span className="hidden sm:block text-xs text-[#B0ADA7]">Administración · Equipo</span>
        </div>
      </header>

      <main className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-9 pb-20">
        {/* ── PAGE TITLE ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 py-7">
          <div>
            <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.035em] text-[#1A1815] leading-[1.1]">
              Administración del Equipo
            </h1>
            <p className="text-[0.85rem] text-[#908E88] mt-1.5">
              Gestiona miembros, roles y atributos del equipo
            </p>
          </div>
          <button
            onClick={openNewMember}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1815] text-white text-[0.82rem] font-medium rounded-xl
              transition-all hover:shadow-[0_0_24px_rgba(96,175,255,0.35)] self-start sm:self-auto flex-shrink-0"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar miembro
          </button>
        </div>

        {/* ── TOP ROW: Team info + Performance ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TeamInfoPanel team={team} onEdit={() => setShowTeamModal(true)} />
          <PerformanceStrip />
        </div>

        {/* ── MEMBERS SECTION ── */}
        <div className="mb-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#B0ADA7]">
                Miembros
              </p>
              <span className="text-[0.68rem] bg-[#F5F4F1] text-[#706E69] px-2 py-0.5 rounded-full font-medium">
                {filtered.length} / {members.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0ADA7]"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="pl-8 pr-3 py-2 w-full sm:w-44 rounded-xl border border-[#E4E2DE] text-[0.78rem] text-[#35322E] bg-white outline-none
                    focus:border-[rgba(96,175,255,0.5)] focus:shadow-[0_0_0_3px_rgba(96,175,255,0.08)] transition-all"
                />
              </div>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="px-3 py-2 rounded-xl border border-[#E4E2DE] text-[0.75rem] text-[#706E69] bg-white outline-none cursor-pointer
                  focus:border-[rgba(96,175,255,0.4)] transition-all"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="away">Ausentes</option>
                <option value="offline">Inactivos</option>
              </select>

              {/* Role filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as Role | 'all')}
                className="px-3 py-2 rounded-xl border border-[#E4E2DE] text-[0.75rem] text-[#706E69] bg-white outline-none cursor-pointer
                  focus:border-[rgba(96,175,255,0.4)] transition-all"
              >
                <option value="all">Todos los roles</option>
                {allRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {/* View toggle */}
              <div className="flex bg-[#F5F4F1] rounded-xl p-0.5 gap-0.5">
                {(['grid', 'list'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setViewMode(v)}
                    className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-all
                      ${viewMode === v ? 'bg-white shadow-sm text-[#35322E]' : 'text-[#B0ADA7] hover:text-[#706E69]'}`}
                  >
                    {v === 'grid' ? (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                      </svg>
                    ) : (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      >
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F4F1] flex items-center justify-center mb-4">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B0ADA7"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="text-[0.85rem] font-medium text-[#706E69]">Sin resultados</p>
              <p className="text-[0.75rem] text-[#B0ADA7] mt-1">
                Ajusta los filtros o agrega un nuevo miembro
              </p>
            </div>
          )}

          {/* GRID view */}
          {viewMode === 'grid' && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filtered.map((m) => (
                <MemberCard key={m.id} member={m} onEdit={openEditMember} onRemove={handleRemove} />
              ))}
              {/* Add card */}
              <button
                onClick={openNewMember}
                className="border-2 border-dashed border-[#E4E2DE] rounded-2xl p-4 flex flex-col items-center justify-center gap-2
                  text-[#B0ADA7] hover:border-[rgba(96,175,255,0.4)] hover:text-[#60AFFF] hover:bg-[rgba(96,175,255,0.02)]
                  transition-all min-h-[148px] group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F5F4F1] group-hover:bg-[rgba(96,175,255,0.08)] flex items-center justify-center transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <span className="text-[0.75rem] font-medium">Agregar miembro</span>
              </button>
            </div>
          )}

          {/* LIST view */}
          {viewMode === 'list' && filtered.length > 0 && (
            <Panel>
              <div className="hidden sm:grid grid-cols-[36px_1fr_120px_80px_100px_64px] gap-3 px-4 py-2.5 border-b border-[#F5F4F1]">
                {['', 'Miembro', 'Rol', 'Estado', 'Progreso', ''].map((h, i) => (
                  <span
                    key={i}
                    className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#B0ADA7]"
                  >
                    {h}
                  </span>
                ))}
              </div>
              <div className="p-2">
                {filtered.map((m) => (
                  <MemberListRow
                    key={m.id}
                    member={m}
                    onEdit={openEditMember}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </Panel>
          )}
        </div>
      </main>

      {/* ── MODALS ── */}
      {showMemberModal && editingMember && (
        <MemberModal
          member={editingMember}
          onSave={handleSaveMember}
          onClose={() => {
            setShowMemberModal(false);
            setEditingMember(null);
          }}
        />
      )}
      {showTeamModal && (
        <TeamModal
          team={team}
          onSave={(t) => {
            setTeam(t);
            setShowTeamModal(false);
            showToast('Equipo actualizado');
          }}
          onClose={() => setShowTeamModal(false)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={confirmRemove}
          onClose={() => setDeleteTarget(null)}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
