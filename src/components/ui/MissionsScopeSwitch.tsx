import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils/utils';

interface MissionsScopeSwitchProps {
  value: 'team' | 'mine';
  onChange: (value: 'team' | 'mine') => void;
  className?: string;
}

export function MissionsScopeSwitch({ value, onChange, className }: MissionsScopeSwitchProps) {
  return (
    <div
      className={cn(
        'lg:hidden sticky top-14 md:top-[62px] z-40',
        'bg-primary dark:bg-gray-800 border-b border-grey-150 dark:border-gray-700',
        'px-4 py-2 flex items-center justify-center',
        className,
      )}
    >
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => {
          if (v === 'team' || v === 'mine') onChange(v);
        }}
        className="bg-grey-100 dark:bg-gray-900 rounded-xl p-1 gap-0 w-full max-w-xs"
      >
        <ToggleGroupItem
          value="team"
          className={cn(
            'flex-1 rounded-lg text-xs font-body font-medium h-8 transition-all duration-200',
            value === 'team'
              ? 'bg-primary dark:bg-gray-800 text-grey-900 dark:text-white shadow-sm'
              : 'text-grey-500 dark:text-gray-400 hover:text-grey-700 dark:hover:text-gray-300',
          )}
        >
          Equipo
        </ToggleGroupItem>
        <ToggleGroupItem
          value="mine"
          className={cn(
            'flex-1 rounded-lg text-xs font-body font-medium h-8 transition-all duration-200',
            value === 'mine'
              ? 'bg-primary dark:bg-gray-800 text-grey-900 dark:text-white shadow-sm'
              : 'text-grey-500 dark:text-gray-400 hover:text-grey-700 dark:hover:text-gray-300',
          )}
        >
          Mis Misiones
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
