type KpiVariant = 'todo' | 'progress' | 'qa' | 'done' | 'overdue'

interface KpiCardProps {
  variant: KpiVariant
  label: string
  value: number
  sub: string
  badge: string
  badgeType: 'up' | 'down' | 'warn'
}

const VARIANT_STYLES: Record<KpiVariant, {
  barBg: string
  barShadow: string
  innerGlow: string
}> = {
  todo: {
    barBg: 'linear-gradient(90deg,#9b7fe1,#5961F9)',
    barShadow: '0 0 18px rgba(155,127,225,0.8)',
    innerGlow: 'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(155,127,225,0.07) 0%,transparent 70%)',
  },
  progress: {
    barBg: 'linear-gradient(90deg,#86F0FD,#60AFFF)',
    barShadow: '0 0 18px rgba(134,240,253,0.8)',
    innerGlow: 'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(96,175,255,0.07) 0%,transparent 70%)',
  },
  qa: {
    barBg: 'linear-gradient(90deg,#FF94AE,#F65A70)',
    barShadow: '0 0 18px rgba(255,148,174,0.8)',
    innerGlow: 'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(255,148,174,0.07) 0%,transparent 70%)',
  },
  done: {
    barBg: 'linear-gradient(90deg,#9CEDC1,#CEFB7C)',
    barShadow: '0 0 18px rgba(156,237,193,0.8)',
    innerGlow: 'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(156,237,193,0.08) 0%,transparent 70%)',
  },
  overdue: {
    barBg: 'linear-gradient(90deg,#F65A70,#FFAF93)',
    barShadow: '0 0 18px rgba(246,90,112,0.8)',
    innerGlow: 'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(246,90,112,0.07) 0%,transparent 70%)',
  },
}

const BADGE_CLASSES: Record<'up' | 'down' | 'warn', string> = {
  up:   'bg-[rgba(156,237,193,0.2)] text-[#2e9660]',
  down: 'bg-[rgba(246,90,112,0.12)] text-[#c94155]',
  warn: 'bg-[rgba(255,148,174,0.15)] text-[#b85570]',
}

export function KpiCard({ variant, label, value, sub, badge, badgeType }: KpiCardProps) {
  const styles = VARIANT_STYLES[variant]

  return (
    <div className="relative bg-white border border-grey-150 rounded-[14px] px-5 pt-5 pb-4 overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
      {/* Top neon bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]"
        style={{ background: styles.barBg, boxShadow: styles.barShadow }}
      />
      {/* Inner ambient glow */}
      <div
        className="absolute inset-0 rounded-[14px] pointer-events-none opacity-50"
        style={{ background: styles.innerGlow }}
      />

      <div className="relative z-10">
        <p className="text-[0.7rem] font-medium text-grey-500 mb-2.5">{label}</p>
        <p className="text-[2.1rem] font-semibold tracking-[-0.04em] text-grey-900 leading-none">
          {value}
        </p>
        <p className="text-[0.72rem] text-grey-400 mt-1.5">{sub}</p>
        <span className={`inline-flex items-center gap-1 text-[0.67rem] font-semibold px-2 py-0.5 rounded-full mt-2 ${BADGE_CLASSES[badgeType]}`}>
          {badge}
        </span>
      </div>
    </div>
  )
}
