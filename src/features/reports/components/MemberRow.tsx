import { AppProgress } from '@/components/ui/AppProgress';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';

import type { ReportMemberRow } from '../types/types.ts';

interface MemberRowProps {
  member: ReportMemberRow;
}

const AVATAR_STYLES: Record<string, { background: string; boxShadow: string }> = {
  'av-at': {
    background: 'linear-gradient(135deg,#60AFFF,#5961F9)',
    boxShadow: '0 0 14px rgba(96,175,255,0.5)',
  },
  'av-jr': {
    background: 'linear-gradient(135deg,#9CEDC1,#86F0FD)',
    boxShadow: '0 0 14px rgba(134,240,253,0.45)',
  },
  'av-ml': {
    background: 'linear-gradient(135deg,#F65A70,#FF94AE)',
    boxShadow: '0 0 14px rgba(246,90,112,0.45)',
  },
  'av-cs': {
    background: 'linear-gradient(135deg,#FF94AE,#FCE98D)',
    boxShadow: '0 0 14px rgba(255,148,174,0.45)',
  },
  'av-lv': {
    background: 'linear-gradient(135deg,#9b7fe1,#5961F9)',
    boxShadow: '0 0 14px rgba(155,127,225,0.5)',
  },
  'av-dm': {
    background: 'linear-gradient(135deg,#86F0FD,#60AFFF)',
    boxShadow: '0 0 14px rgba(134,240,253,0.45)',
  },
  'av-rp': {
    background: 'linear-gradient(135deg,#F65A70,#9b7fe1)',
    boxShadow: '0 0 14px rgba(246,90,112,0.38)',
  },
  'av-kn': {
    background: 'linear-gradient(135deg,#9CEDC1,#5961F9)',
    boxShadow: '0 0 14px rgba(89,97,249,0.38)',
  },
  'av-so': {
    background: 'linear-gradient(135deg,#FCE98D,#FF94AE)',
    boxShadow: '0 0 14px rgba(252,233,141,0.45)',
  },
};

export function MemberRow({ member }: MemberRowProps) {
  const rawPct = member.total > 0 ? Math.round((member.completed / member.total) * 100) : 0;
  const pct = Number.isFinite(rawPct) ? rawPct : 0;
  const avatarStyle = AVATAR_STYLES[member.avatarClass] ?? {
    background: 'linear-gradient(135deg,#B0ADA7,#908E88)',
    boxShadow: 'none',
  };

  return (
    <div
      className="grid items-center gap-3 py-3 border-b border-grey-100 last:border-0 rounded-lg transition-all hover:bg-grey-50 hover:px-1
      grid-cols-[38px_1fr_130px_52px] sm:grid-cols-[38px_1fr_140px_54px]"
    >
      {/* Avatar */}
      <UserAvatar
        src={member.photoUrl}
        alt={member.name}
        initials={member.initials}
        className="w-9 h-9"
        fallbackClassName="text-white tracking-wide"
        fallbackStyle={avatarStyle}
      />

      {/* Name + role */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-grey-800 truncate">{member.name}</p>
        <p className="text-xs text-grey-400 mt-px">{member.role}</p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between mb-1.5 text-xs text-grey-500">
          <span>Completadas</span>
          <span>
            {member.completed}/{member.total}
          </span>
        </div>
        <AppProgress
          value={pct}
          gradientStyle={member.barGradient}
          glow={member.barGlow}
          height="h-[5px]"
        />
      </div>

      {/* Percentage */}
      <p
        className="text-sm font-semibold text-right whitespace-nowrap"
        style={{ color: member.pctColor }}
      >
        {pct}%
      </p>
    </div>
  );
}
