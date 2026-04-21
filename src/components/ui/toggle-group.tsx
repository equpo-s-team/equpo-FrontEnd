import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import * as React from 'react';

import { cn } from '@/lib/utils';

const ToggleGroupContext = React.createContext<VariantProps | undefined>(undefined);

type VariantProps = {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
};

const toggleGroupItemVariants = ({ variant = 'default', size = 'default' }: VariantProps = {}) => {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-secondary data-[state=on]:text-grey-900';

  const variantClass =
    variant === 'outline'
      ? 'border border-grey-200 bg-transparent hover:bg-secondary hover:text-grey-900'
      : 'bg-transparent hover:bg-secondary hover:text-grey-900';

  const sizeClass = size === 'sm' ? 'h-8 px-2.5' : size === 'lg' ? 'h-10 px-3.5' : 'h-9 px-3';

  return `${base} ${variantClass} ${sizeClass}`;
};

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('flex items-center justify-center gap-1', className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleGroupItemVariants({
          variant: context?.variant ?? variant,
          size: context?.size ?? size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
