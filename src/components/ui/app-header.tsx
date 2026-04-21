import React from 'react';
import { cn } from '@/lib/utils';

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'blue' | 'purple' | 'green' | 'orange';
  actions?: React.ReactNode;
  className?: string;
}

export function AppHeader({
  title,
  subtitle,
  variant = 'blue',
  actions,
  className = '',
}: AppHeaderProps) {
  const colorConfig = {
    blue: {
      bg: 'bg-blue',
      shadow: '0 0 8px #60AFFF, 0 0 18px rgba(96,175,255,0.4)',
    },
    purple: {
      bg: 'bg-purple',
      shadow: '0 0 8px #5961F9, 0 0 18px rgba(89,97,249,0.4)',
    },
    green: {
      bg: 'bg-green',
      shadow: '0 0 8px #10B981, 0 0 18px rgba(16,185,129,0.4)',
    },
    orange: {
      bg: 'bg-orange',
      shadow: '0 0 8px #F97316, 0 0 18px rgba(249,115,22,0.4)',
    },
  };

  const config = colorConfig[variant];

  return (
    <header
      className={`
        sticky top-0 z-50
        bg-primary border-b border-grey-200
        shadow-[0_1px_8px_rgba(0,0,0,0.06)]
        h-14 md:h-[62px]
        flex items-center justify-between
        px-4 md:px-8
        ${className}
      `}
    >
      <div className="flex items-center gap-2.5 font-maxwell tracking-tight text-grey-900 text-base md:text-lg font-bold select-none">
        <span
          className={cn('w-2.5 h-2.5 rounded-full animate-pulse-neon', config.bg)}
          style={{ boxShadow: config.shadow }}
        />
        <div className="flex flex-col">
          <span>{title}</span>
          {subtitle && (
            <span className="text-xs text-grey-400 font-normal">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}
