import { type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconClassName,
  size = 'md',
}: EmptyStateProps) {
  const sizeConfig = {
    sm: {
      wrapper: 'py-6',
      iconBox: 'w-10 h-10',
      iconSize: 18,
      titleClass: 'text-sm',
      descClass: 'text-xs',
    },
    md: {
      wrapper: 'py-10',
      iconBox: 'w-14 h-14',
      iconSize: 22,
      titleClass: 'text-sm',
      descClass: 'text-xs',
    },
    lg: {
      wrapper: 'py-16',
      iconBox: 'w-16 h-16',
      iconSize: 26,
      titleClass: 'text-base',
      descClass: 'text-sm',
    },
  }[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeConfig.wrapper,
        className,
      )}
    >
      <div
        className={cn(
          'rounded-2xl bg-secondary dark:bg-gray-700 flex items-center justify-center mb-4',
          sizeConfig.iconBox,
          iconClassName,
        )}
      >
        <Icon size={sizeConfig.iconSize} className="text-grey-400" />
      </div>
      <p className={cn('font-maxwell text-grey-700 dark:text-grey-300 mb-1', sizeConfig.titleClass)}>{title}</p>
      {description && (
        <p
          className={cn(
            'font-body text-grey-400 dark:text-grey-300 max-w-[220px] leading-relaxed',
            sizeConfig.descClass,
          )}
        >
          {description}
        </p>
      )}
      {action && (
        <Button
          variant="outline"
          size="sm"
          onClick={action.onClick}
          className="mt-4 border-grey-200 text-grey-700 rounded-xl font-body text-xs hover:border-blue hover:text-blue"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
