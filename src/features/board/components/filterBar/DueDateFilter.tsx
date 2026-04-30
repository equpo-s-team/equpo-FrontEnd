import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {CalendarDays, ChevronDown, ChevronDownIcon} from "lucide-react";
import {useState} from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from '@/components/ui/calendar.tsx';
import { FilterPanelFooter } from "@/components/ui/FilterPanelFooter.tsx";
import { Pill } from "@/components/ui/Pill.tsx";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';

import { type dueDateFilterProp } from "../../types";
import { DropPanel } from "./DropPanel";

export function DueDateFilter({ value, onChange }: dueDateFilterProp) {
  const [open, setOpen] = useState(false);

  const label = value
    ? `Antes del ${new Date(value + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`
    : 'Fecha límite';

  return (
    <div className="relative">
      <Pill active={Boolean(value)} onClick={() => setOpen((o) => !o)}>
        <CalendarDays size={12} />
        <span>{label}</span>
        <ChevronDown
          size={11}
          className={`opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </Pill>
      <DropPanel open={open} onClose={() => setOpen(false)}>
        <div className="p-3">
          <p className="text-[11px] font-semibold text-grey-500 uppercase tracking-wide mb-2">
            Mostrar tareas antes de:
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-left font-normal border-[1.5px] border-grey-200 text-[13px] font-body bg-primary text-grey-800 outline-none focus:border-blue transition-colors duration-150"
              >
                {value ? format(new Date(value), 'PPP', { locale: es }) : 'Seleccionar fecha'}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    onChange(date.toISOString().split('T')[0]);
                  } else {
                    onChange(null);
                  }
                }}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
        <FilterPanelFooter onClear={() => onChange(null)} onApply={() => setOpen(false)} />
      </DropPanel>
    </div>
  );
}
