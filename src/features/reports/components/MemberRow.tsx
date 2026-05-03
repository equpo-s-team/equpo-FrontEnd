import { AppProgress } from '@/components/ui/AppProgress';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';

import type { ReportMemberRow } from '../types/types.ts';

interface MemberRowProps {
  member: ReportMemberRow;
}

export function MemberRow({ member }: MemberRowProps) {
  const rawPct = member.total > 0 ? Math.round((member.completed / member.total) * 100) : 0;
  const pct = Number.isFinite(rawPct) ? rawPct : 0;

  return (
    <div
      className="grid items-center gap-2 sm:gap-3 py-2 sm:py-3 px-1 border-b border-grey-100 dark:border-gray-700 last:border-0 rounded-lg transition-all hover:bg-grey-50 dark:hover:bg-gray-700
      grid-cols-[32px_1fr_auto_auto] sm:grid-cols-[38px_1fr_140px_54px]"
    >
      {/* Avatar */}
      <UserAvatar
        src={member.photoUrl}
        alt={member.name}
        className="w-8 sm:w-9 h-8 sm:h-9"
        fallbackClassName="text-white tracking-wide text-xs sm:text-sm"
      />

      {/* Name + role */}
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-medium text-grey-800 dark:text-gray-300 truncate">{member.name}</p>
        <p className="text-xs text-grey-400 dark:text-grey-500 mt-px">{member.role}</p>
      </div>

      {/* Progress bar - hidden on mobile, shown on sm+ */}
      <div className="hidden sm:block">
        <div className="flex justify-between mb-1.5 text-xs text-grey-500 dark:text-grey-400">
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
        className="text-xs sm:text-sm font-semibold text-right whitespace-nowrap"
        style={{ color: member.pctColor }}
      >
        {pct}%
      </p>
    </div>
  );
}
