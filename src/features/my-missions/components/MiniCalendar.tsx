import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Calendar } from '@/components/ui/calendar';
import type { TeamTask } from '@/features/board/types';

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasksByDate: Map<string, TeamTask[]>;
}

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function MiniCalendar({
  selectedDate,
  onDateSelect,
  tasksByDate,
}: MiniCalendarProps) {
  return (
    <div className="rounded-2xl bg-white border border-grey-150 shadow-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-grey-800 font-body">
          {format(selectedDate, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="text-xs text-grey-500">
          {tasksByDate.get(toDateKey(selectedDate))?.length || 0} tareas
        </div>
      </div>
      
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (date) onDateSelect(date);
        }}
        defaultMonth={selectedDate}
        locale={es}
        className="w-full"
        modifiers={{
          hasTask: (date) => {
            return !!tasksByDate.get(toDateKey(date))?.length;
          }
        }}
        modifiersStyles={{
          hasTask: {
            position: 'relative'
          }
        }}
      />
    </div>
  );
}
