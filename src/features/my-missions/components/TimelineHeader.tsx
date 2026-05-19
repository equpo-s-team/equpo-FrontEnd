import { ChevronLeft, ChevronRight } from 'lucide-react';

type TimelineView = 'day' | 'week' | 'month' | 'year';

interface TimelineHeaderProps {
  view: TimelineView;
  onViewChange: (v: TimelineView) => void;
  label: string;
  onPrev: () => void;
  onNext: () => void;
}

const VIEW_LABELS: Record<TimelineView, string> = {
  day: 'Día',
  week: 'Semana',
  month: 'Mes',
  year: 'Año',
};

const VIEWS: TimelineView[] = ['day', 'week', 'month', 'year'];

export default function TimelineHeader({
  view,
  onViewChange,
  label,
  onPrev,
  onNext,
}: TimelineHeaderProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-4 sm:px-5 py-3 border-b border-grey-150 dark:border-gray-700 shrink-0 shadow-[0_2px_8px_rgba(89,97,249,0.15)]"
      style={{ background: 'linear-gradient(135deg, #5961F9 0%, #60AFFF 100%)' }}
    >
      <div className="flex items-center bg-black/10 backdrop-blur-sm rounded-xl p-0.5 self-start sm:self-auto">
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`px-3 py-1 font-body text-xs font-bold rounded-lg transition-all ${
              view === v
                ? 'bg-white text-blue shadow-neonBlue'
                : 'text-white/80 hover:text-white hover:bg-white/10 cursor-pointer'
            }`}
          >
            {VIEW_LABELS[v]}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 min-w-0">
        <span className="text-xs font-semibold text-white/90 font-body capitalize whitespace-nowrap truncate min-w-0">
          {label}
        </span>
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={onPrev} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <ChevronLeft size={14} className="text-white" />
          </button>
          <button onClick={onNext} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <ChevronRight size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
