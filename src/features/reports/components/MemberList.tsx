import { MemberRow } from '@/features/reports/components/MemberRow.tsx';
import { useScrollFade } from '@/features/reports/hooks/useScrollFade.ts';

import type { ReportMemberRow } from '../types/types.ts';

interface MemberListProps {
  members: ReportMemberRow[];
}

export function MemberList({ members }: MemberListProps) {
  const { ref, atBottom, onScroll } = useScrollFade();

  return (
    <div
      className="relative flex flex-1 min-h-0 flex-col bg-white dark:bg-gray-800 border border-grey-150 dark:border-gray-700 rounded-[14px] p-3 sm:p-4 lg:p-6 overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.03)' }}
    >
      {/* Corner neon glow */}
      <div
        className="absolute top-0 right-0 w-44 h-44 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(96,175,255,0.10) 0%, transparent 65%)' }}
      />

      <div className="panel-header flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-5 relative z-10 gap-2">
        <h2 className="text-sm font-semibold text-grey-800 tracking-[-0.01em]">
          Contribucion por miembro
        </h2>
        <span className="text-xs text-grey-400 shrink-0">
          {members.length} miembros · scroll
        </span>
      </div>

      {/* Scrollable list */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={ref}
          onScroll={onScroll}
          className="h-full min-h-0 overflow-y-auto overflow-x-hidden pr-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#E4E2DE transparent' }}
        >
          {members.map((member) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </div>

        {/* Fade overlay */}
        {!atBottom && (
          <div className="absolute bottom-0 left-0 right-1 h-12 pointer-events-none rounded-b-lg bg-gradient-to-top from-white to-transparent dark:from-gray-800 dark:to-gray-700" />
        )}
      </div>
    </div>
  );
}
