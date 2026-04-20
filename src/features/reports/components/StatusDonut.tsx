import type { KpiData } from '../types/types.ts';

interface StatusDonutProps {
  data: KpiData;
}

const STATUS_ITEMS = [
  { key: 'done', label: 'Done', color: '#9CEDC1', glow: '0 0 10px rgba(156,237,193,0.9)' },
  {
    key: 'progress',
    label: 'In Progress',
    color: '#86F0FD',
    glow: '0 0 10px rgba(134,240,253,0.9)',
  },
  { key: 'todo', label: 'To Do', color: '#9b7fe1', glow: '0 0 10px rgba(155,127,225,0.8)' },
  { key: 'qa', label: 'In QA', color: '#FF94AE', glow: '0 0 10px rgba(255,148,174,0.8)' },
] as const;

export function StatusDonut({ data }: StatusDonutProps) {
  const safeValue = (value: number): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  };

  const totals = {
    todo: safeValue(data.todo),
    progress: safeValue(data.progress),
    qa: safeValue(data.qa),
    done: safeValue(data.done),
    overdue: safeValue(data.overdue),
  };

  const total = totals.todo + totals.progress + totals.qa + totals.done + totals.overdue;

  const ratio = (value: number): number => {
    if (total <= 0) {
      return 0;
    }

    const r = value / total;
    return Number.isFinite(r) && r > 0 ? r : 0;
  };

  const donePct = total > 0 ? Math.round((totals.done / total) * 100) : 0;

  const C = 2 * Math.PI * 52;
  type SegKey = 'done' | 'progress' | 'qa' | 'todo' | 'overdue';
  const segs: { key: SegKey; grad: string; offset: number; dash: number }[] = [
    { key: 'done', grad: 'url(#gD)', offset: 0, dash: ratio(totals.done) * C },
    {
      key: 'progress',
      grad: 'url(#gP)',
      offset: -ratio(totals.done) * C - 2,
      dash: ratio(totals.progress) * C,
    },
    {
      key: 'qa',
      grad: 'url(#gQ)',
      offset: -ratio(totals.done + totals.progress) * C - 4,
      dash: ratio(totals.qa) * C,
    },
    {
      key: 'todo',
      grad: 'url(#gT)',
      offset: -ratio(totals.done + totals.progress + totals.qa) * C - 6,
      dash: ratio(totals.todo) * C,
    },
    {
      key: 'overdue',
      grad: 'url(#gO)',
      offset: -ratio(totals.done + totals.progress + totals.qa + totals.todo) * C - 8,
      dash: ratio(totals.overdue) * C,
    },
  ];

  return (
    <div
      className="relative bg-white border border-grey-150 rounded-[14px] p-6 overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.03)' }}
    >
      {/* Corner neon glow */}
      <div
        className="absolute top-0 right-0 w-44 h-44 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(156,237,193,0.12) 0%, transparent 65%)',
        }}
      />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <h2 className="text-sm font-semibold text-grey-800 tracking-[-0.01em]">Estado general</h2>
        <span className="text-xs text-grey-400">{total} tareas</span>
      </div>

      <div className="flex flex-row items-center gap-5 relative z-10">
        {/* SVG Donut */}
        <div className="relative w-[156px] h-[156px] flex-shrink-0">
          <svg
            viewBox="0 0 156 156"
            width="156"
            height="156"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle cx="78" cy="78" r="52" fill="none" stroke="#EEECEA" strokeWidth="20" />
            {segs.map((s) => (
              <circle
                key={s.key}
                cx="78"
                cy="78"
                r="52"
                fill="none"
                stroke={s.grad}
                strokeWidth="20"
                strokeDasharray={`${s.dash} ${C - s.dash}`}
                strokeDashoffset={s.offset}
                strokeLinecap="round"
              />
            ))}
            <defs>
              <linearGradient id="gD" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9CEDC1" />
                <stop offset="100%" stopColor="#CEFB7C" />
              </linearGradient>
              <linearGradient id="gP" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#86F0FD" />
                <stop offset="100%" stopColor="#60AFFF" />
              </linearGradient>
              <linearGradient id="gQ" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF94AE" />
                <stop offset="100%" stopColor="#F65A70" />
              </linearGradient>
              <linearGradient id="gT" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9b7fe1" />
                <stop offset="100%" stopColor="#5961F9" />
              </linearGradient>
              <linearGradient id="gO" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F65A70" />
                <stop offset="100%" stopColor="#FFAF93" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold text-grey-900 tracking-[-0.04em]">
              {donePct}%
            </span>
            <span className="text-xs text-grey-400 mt-0.5">completado</span>
          </div>
        </div>

        {/* Status grid */}
        <div className="w-full grid grid-cols-2 gap-1.5">
          {STATUS_ITEMS.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-2 px-3 py-2.5 bg-grey-50 border border-grey-100 rounded-xl"
            >
              <div
                className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                style={{ background: item.color, boxShadow: item.glow }}
              />
              <div>
                <p className="text-xs text-grey-500">{item.label}</p>
                <p className="text-sm font-semibold text-grey-800">
                  {totals[item.key as keyof typeof totals]}{' '}
                  <span className="text-xs font-normal text-grey-400">
                    {total > 0
                      ? Math.round((totals[item.key as keyof typeof totals] / total) * 100)
                      : 0}
                    %
                  </span>
                </p>
              </div>
            </div>
          ))}

          {/* Overdue - full width */}
          <div className="col-span-2 flex items-center gap-2 px-3 py-2.5 bg-[rgba(246,90,112,0.04)] border border-[rgba(246,90,112,0.2)] rounded-xl">
            <div
              className="w-[7px] h-[7px] rounded-full flex-shrink-0"
              style={{ background: '#F65A70', boxShadow: '0 0 12px rgba(246,90,112,0.9)' }}
            />
            <div className="flex-1">
              <p className="text-xs text-grey-500">Vencidas</p>
              <p className="text-sm font-semibold text-[#c94155]">
                {totals.overdue}{' '}
                <span className="text-xs font-normal text-grey-400">
                  {total > 0 ? Math.round((totals.overdue / total) * 100) : 0}%
                </span>
              </p>
            </div>
            <span className="text-xs text-[#c94155] font-medium">⚠ atención</span>
          </div>
        </div>
      </div>
    </div>
  );
}
