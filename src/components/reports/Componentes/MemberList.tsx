import { useScrollFade } from '../Hooks/useScrollFade.ts'
import { MemberRow } from './MemberRow.tsx'
import type { TeamMember } from '../types'

interface MemberListProps {
  members: TeamMember[]
}

const DIST_SEGMENTS = [
  { width: '13%', gradient: 'linear-gradient(90deg,#60AFFF,#5961F9)',   glow: '0 0 8px rgba(96,175,255,0.55)'   },
  { width: '11%', gradient: 'linear-gradient(90deg,#9CEDC1,#86F0FD)',   glow: '0 0 8px rgba(134,240,253,0.5)'  },
  { width: '14%', gradient: 'linear-gradient(90deg,#F65A70,#FF94AE)',   glow: '0 0 8px rgba(246,90,112,0.5)'   },
  { width: '16%', gradient: 'linear-gradient(90deg,#FF94AE,#FCE98D)',   glow: '0 0 8px rgba(255,148,174,0.45)' },
  { width: '10%', gradient: 'linear-gradient(90deg,#9b7fe1,#5961F9)',   glow: '0 0 8px rgba(155,127,225,0.5)'  },
  { width:  '9%', gradient: 'linear-gradient(90deg,#86F0FD,#60AFFF)',   glow: '0 0 8px rgba(134,240,253,0.4)'  },
  { width: '12%', gradient: 'linear-gradient(90deg,#F65A70,#9b7fe1)',   glow: '0 0 8px rgba(246,90,112,0.35)'  },
  { width:  '9%', gradient: 'linear-gradient(90deg,#9CEDC1,#5961F9)',   glow: '0 0 8px rgba(89,97,249,0.35)'   },
  { width:  '6%', gradient: 'linear-gradient(90deg,#FCE98D,#FF94AE)',   glow: '0 0 8px rgba(252,233,141,0.45)' },
]

const LEGEND_DOTS = [
  { color: '#5961F9',  glow: '0 0 7px rgba(89,97,249,0.7)',    name: 'A. Torres'  },
  { color: '#86F0FD',  glow: '0 0 7px rgba(134,240,253,0.7)',  name: 'J. Ramírez' },
  { color: '#F65A70',  glow: '0 0 7px rgba(246,90,112,0.7)',   name: 'M. López'   },
  { color: '#FF94AE',  glow: '0 0 7px rgba(255,148,174,0.6)',  name: 'C. Soto'    },
  { color: '#9b7fe1',  glow: '0 0 7px rgba(155,127,225,0.6)',  name: 'L. Vargas'  },
  { color: '#60AFFF',  glow: '0 0 7px rgba(96,175,255,0.6)',   name: 'D. Morales' },
  { color: '#9b7fe1',  glow: '0 0 6px rgba(155,127,225,0.5)',  name: 'R. Paredes' },
  { color: '#9CEDC1',  glow: '0 0 6px rgba(156,237,193,0.6)',  name: 'K. Núñez'   },
  { color: '#FCE98D',  glow: '0 0 6px rgba(252,233,141,0.6)',  name: 'S. Ortega'  },
]

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

      {/* Distribution bar */}
      <div className="flex w-full h-[7px] rounded-full overflow-hidden gap-0.5 mb-3.5">
        {DIST_SEGMENTS.map((seg, i) => (
          <div
            key={i}
            className="h-full rounded-full"
            style={{ width: seg.width, background: seg.gradient, boxShadow: seg.glow }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5">
        {LEGEND_DOTS.map(dot => (
          <div key={dot.name} className="flex items-center gap-1.5 text-[0.75rem] text-grey-600">
            <div
              className="w-[7px] h-[7px] rounded-full flex-shrink-0"
              style={{ background: dot.color, boxShadow: dot.glow }}
            />
            {dot.name}
          </div>
        ))}
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
