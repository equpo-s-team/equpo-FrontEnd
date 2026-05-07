import type { RewardType } from '@/features/shop/types/rewardTypes.ts';
import { cn } from '@/lib/utils/utils.ts';

interface ShopFilterTabsProps {
  active: RewardType | 'all';
  hasEqupo: boolean;
  onChange: (filter: RewardType | 'all') => void;
}

const TABS: { id: RewardType | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'member', label: 'Miembro' },
  { id: 'team', label: 'Equipo' },
  { id: 'equpo', label: 'Equpo' },
];

export function ShopFilterTabs({ active, hasEqupo, onChange }: ShopFilterTabsProps) {
  const visible = TABS.filter((t) => t.id !== 'equpo' || hasEqupo);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {visible.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer',
            active === tab.id
              ? 'bg-blue text-white border-blue shadow-sm'
              : 'bg-white dark:bg-gray-800 text-grey-500 dark:text-grey-400 border-grey-200 dark:border-gray-600 hover:border-blue/40 hover:text-blue',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
