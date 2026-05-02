import { cn } from '@/lib/utils';

interface AppProgressProps {
  value: number;
  gradient?: string;
  gradientStyle?: string;
  glow?: string;
  height?: string;
  className?: string;
}

export function AppProgress({
  value,
  gradient,
  gradientStyle,
  glow,
  height = 'h-1',
  className,
}: AppProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full bg-secondary dark:bg-gray-700 rounded-full overflow-hidden', height, className)}>
      <div
        className={cn(
          'h-full rounded-full relative transition-[width] duration-500 ease-out',
          gradient,
        )}
        style={{
          width: `${clampedValue}%`,
          ...(gradientStyle ? { background: gradientStyle } : {}),
          ...(glow ? { boxShadow: glow } : {}),
        }}
      >
        {clampedValue > 0 && (
          <div
            className="absolute right-0 top-0 bottom-0 w-1.5 blur-[2px] rounded-full"
            style={{ background: 'inherit' }}
          />
        )}
      </div>
    </div>
  );
}
