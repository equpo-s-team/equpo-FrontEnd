import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TimePickerProps {
  value?: string; // HH:MM format
  onChange: (time: string) => void;
  placeholder?: string;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  placeholder = 'Seleccionar hora',
  className = 'w-full',
}: TimePickerProps) {
  const [selectedHour, selectedMinute] = value?.split(':') || ['', ''];
  const [isOpen, setIsOpen] = React.useState(false);

  const handleHourChange = (newHour: string) => {
    const hour = parseInt(newHour);
    if (isNaN(hour)) return;

    const clampedHour = Math.max(0, Math.min(23, hour));
    const formattedHour = String(clampedHour).padStart(2, '0');
    onChange(`${formattedHour}:${selectedMinute || '00'}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    const minute = parseInt(newMinute);
    if (isNaN(minute)) return;

    const clampedMinute = Math.max(0, Math.min(59, minute));
    const formattedMinute = String(clampedMinute).padStart(2, '0');
    onChange(`${selectedHour || '00'}:${formattedMinute}`);
  };

  const incrementHour = () => {
    const hour = parseInt(selectedHour || '0');
    handleHourChange(String((hour + 1) % 24));
  };

  const decrementHour = () => {
    const hour = parseInt(selectedHour || '0');
    handleHourChange(String((hour - 1 + 24) % 24));
  };

  const incrementMinute = () => {
    const minute = parseInt(selectedMinute || '0');
    handleMinuteChange(String((minute + 15) % 60));
  };

  const decrementMinute = () => {
    const minute = parseInt(selectedMinute || '0');
    handleMinuteChange(String((minute - 15 + 60) % 60));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`${className} justify-between text-left font-normal`}>
          {value ? `${value} hrs` : placeholder}
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          {/* Time Display */}
          <div className="text-center">
            <div className="text-2xl font-mono font-semibold text-grey-800">
              {selectedHour || '00'}:{selectedMinute || '00'}
            </div>
            <div className="text-xs text-grey-500 mt-1">Hora local</div>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            {/* Hours */}
            <div>
              <label className="text-xs font-medium text-grey-600 mb-2 block">Hora</label>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={decrementHour} className="h-8 w-8 p-0">
                  <ChevronDownIcon className="h-3 w-3" />
                </Button>
                <input
                  type="text"
                  value={selectedHour || ''}
                  onChange={(e) => handleHourChange(e.target.value)}
                  className="w-16 text-center border border-grey-200 rounded px-2 py-1 text-sm font-mono focus:border-blue focus:outline-none"
                  placeholder="00"
                  maxLength={2}
                />
                <Button variant="outline" size="sm" onClick={incrementHour} className="h-8 w-8 p-0">
                  <ChevronUpIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Minutes */}
            <div>
              <label className="text-xs font-medium text-grey-600 mb-2 block">Minutos</label>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decrementMinute}
                  className="h-8 w-8 p-0"
                >
                  <ChevronDownIcon className="h-3 w-3" />
                </Button>
                <input
                  type="text"
                  value={selectedMinute || ''}
                  onChange={(e) => handleMinuteChange(e.target.value)}
                  className="w-16 text-center border border-grey-200 rounded px-2 py-1 text-sm font-mono focus:border-blue focus:outline-none"
                  placeholder="00"
                  maxLength={2}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={incrementMinute}
                  className="h-8 w-8 p-0"
                >
                  <ChevronUpIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Select */}
          <div className="pt-2 border-t border-grey-100">
            <p className="text-xs font-medium text-grey-600 mb-2">Selección rápida</p>
            <div className="grid grid-cols-3 gap-2">
              {['00:00', '06:00', '12:00', '15:00', '18:00', '23:59'].map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  size="sm"
                  onClick={() => onChange(time)}
                  className={`text-xs ${
                    value === time ? 'bg-blue text-white border-blue' : 'hover:bg-blue/10'
                  }`}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TimePicker;
