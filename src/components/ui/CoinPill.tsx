import { Coins } from 'lucide-react';

import { cn } from '@/lib/utils/utils.ts';

interface CoinPillProps {
  amount: number;
  label?: string;
  variant?: 'team' | 'member';
  className?: string;
}

export function CoinPill({ amount, label, variant = 'member', className }: CoinPillProps) {
  const isTeam = variant === 'team';

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border',
        isTeam
          ? 'bg-violet-50 border-violet-200 dark:bg-violet-900/20 dark:border-violet-700'
          : 'bg-yellow-50 border-orange-200 dark:bg-yellow-900/20 dark:border-orange-700',
        className,
      )}
    >
      <Coins className={cn('w-3.5 h-3.5', isTeam ? 'text-violet-500' : 'text-orange-400')} />
      {label && (
        <span
          className={cn(
            'text-[10px] font-semibold uppercase tracking-widest',
            isTeam ? 'text-violet-400' : 'text-orange-300',
          )}
        >
          {label}
        </span>
      )}
      <span
        className={cn(
          'text-xs font-bold',
          isTeam ? 'text-violet-600 dark:text-violet-400' : 'text-orange-500 dark:text-orange-400',
        )}
      >
        {amount.toLocaleString()}
      </span>
    </div>
  );
}
