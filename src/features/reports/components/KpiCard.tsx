type KpiVariant = 'todo' | 'progress' | 'qa' | 'done' | 'overdue';

interface KpiCardProps {
  variant: KpiVariant;
  label: string;
  value: number;
  sub: string;
}

const VARIANT_STYLES: Record<
  KpiVariant,
  {
    barBg: string;
    barShadow: string;
    innerGlow: string;
    borderColor: string;
    cardGlow: string;
  }
> = {
  todo: {
    barBg: 'linear-gradient(90deg,#9b7fe1,#5961F9)',
    barShadow: '0 0 18px rgba(155,127,225,0.8)',
    innerGlow:
      'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(155,127,225,0.07) 0%,transparent 70%)',
    borderColor: 'rgba(155,127,225,0.38)',
    cardGlow: '0 0 0 1px rgba(155,127,225,0.22), 0 0 16px rgba(155,127,225,0.14)',
  },
  progress: {
    barBg: 'linear-gradient(90deg,#86F0FD,#60AFFF)',
    barShadow: '0 0 18px rgba(134,240,253,0.8)',
    innerGlow:
      'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(96,175,255,0.07) 0%,transparent 70%)',
    borderColor: 'rgba(96,175,255,0.36)',
    cardGlow: '0 0 0 1px rgba(96,175,255,0.2), 0 0 16px rgba(96,175,255,0.14)',
  },
  qa: {
    barBg: 'linear-gradient(90deg,#FF94AE,#F65A70)',
    barShadow: '0 0 18px rgba(255,148,174,0.8)',
    innerGlow:
      'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(255,148,174,0.07) 0%,transparent 70%)',
    borderColor: 'rgba(255,148,174,0.38)',
    cardGlow: '0 0 0 1px rgba(255,148,174,0.22), 0 0 16px rgba(255,148,174,0.14)',
  },
  done: {
    barBg: 'linear-gradient(90deg,#9CEDC1,#CEFB7C)',
    barShadow: '0 0 18px rgba(156,237,193,0.8)',
    innerGlow:
      'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(156,237,193,0.08) 0%,transparent 70%)',
    borderColor: 'rgba(156,237,193,0.38)',
    cardGlow: '0 0 0 1px rgba(156,237,193,0.22), 0 0 16px rgba(156,237,193,0.14)',
  },
  overdue: {
    barBg: 'linear-gradient(90deg,#F65A70,#FFAF93)',
    barShadow: '0 0 18px rgba(246,90,112,0.8)',
    innerGlow:
      'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(246,90,112,0.07) 0%,transparent 70%)',
    borderColor: 'rgba(246,90,112,0.4)',
    cardGlow: '0 0 0 1px rgba(246,90,112,0.24), 0 0 16px rgba(246,90,112,0.16)',
  },
};

export function KpiCard({ variant, label, value, sub }: KpiCardProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className="relative bg-white border rounded-[14px] px-5 pt-5 pb-4 overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ borderColor: styles.borderColor, boxShadow: styles.cardGlow }}
    >
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
        <p className="text-xs font-medium text-grey-500 mb-2.5">{label}</p>
        <p className="text-4xl font-semibold tracking-[-0.04em] text-grey-900 leading-none">
          {value}
        </p>
        <p className="text-xs text-grey-400 mt-1.5">{sub}</p>
      </div>
    </div>
  );
}
