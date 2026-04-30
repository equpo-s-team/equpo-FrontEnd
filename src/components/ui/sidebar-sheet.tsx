import * as React from 'react';

import { cn } from '@/lib/utils';

import { Sheet, SheetContent } from './sheet';

type SheetSide = 'left' | 'right' | 'top' | 'bottom';

type SheetContentProps = React.ComponentPropsWithoutRef<typeof SheetContent>;

interface SidebarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: SheetSide;
  overlayClassName?: string;
  contentClassName?: string;
  contentProps?: Omit<SheetContentProps, 'side' | 'className' | 'children' | 'overlayClassName'>;
  children: React.ReactNode;
}

export function SidebarSheet({
  open,
  onOpenChange,
  side = 'right',
  overlayClassName,
  contentClassName,
  contentProps,
  children,
}: SidebarSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        overlayClassName={cn('bg-grey-900/40 backdrop-blur-[2px]', overlayClassName)}
        className={cn('p-0', contentClassName)}
        {...contentProps}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
