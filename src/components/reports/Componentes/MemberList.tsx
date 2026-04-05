import { useScrollFade } from '../Hooks/useScrollFade.ts'
import { MemberRow } from './MemberRow.tsx'
import type { TeamMember } from '../types'

interface MemberListProps {
  members: TeamMember[]
}

export function MemberList({ members }: MemberListProps) {
  const { ref, atBottom, onScroll } = useScrollFade()

  return (
    <div
      className="relative bg-white border border-grey-150 rounded-[14px] p-6 overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.03)' }}
    >
      {/* Corner neon glow */}
      <div
        className="absolute top-0 right-0 w-44 h-44 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(96,175,255,0.10) 0%, transparent 65%)' }}
      />

      <div className="panel-header flex items-center justify-between mb-5 relative z-10">
        <h2 className="text-[0.88rem] font-semibold text-grey-800 tracking-[-0.01em]">
          Contribución por miembro
        </h2>
        <span className="text-[0.71rem] text-grey-400">
          {members.length} miembros · scroll para ver más
        </span>
      </div>

      {/* Scrollable list */}
      <div className="relative">
        <div
          ref={ref}
          onScroll={onScroll}
          className="max-h-[356px] overflow-y-auto overflow-x-hidden pr-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#E4E2DE transparent' }}
        >
          {members.map(m => (
            <MemberRow key={m.id} member={m} />
          ))}
        </div>

        {/* Fade overlay */}
        {!atBottom && (
          <div
            className="absolute bottom-0 left-0 right-1 h-12 pointer-events-none rounded-b-lg"
            style={{ background: 'linear-gradient(to top, white 35%, transparent)' }}
          />
        )}
      </div>
    </div>
  )
}
