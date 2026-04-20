import { useAvatarState } from '@/lib/avatar/avatarCore.ts';
import { getInitials } from '@/lib/avatar/avatarInitials.ts';
import { cn } from '@/lib/utils.ts';

interface TeamAvatarProps {
  src?: string | null;
  name: string;
  className?: string;
  fallbackClassName?: string;
  style?: React.CSSProperties;
  fallbackStyle?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
}

export function TeamAvatar({
  src,
  name,
  className,
  fallbackClassName,
  style,
  fallbackStyle,
  loading = 'lazy',
}: TeamAvatarProps) {
  const { shouldRenderImage, normalizedSrc, onError } = useAvatarState(src);
  const fallbackText = getInitials(name, 'EQ');

  const baseImageClasses = cn('w-10 h-10 rounded-xl object-cover flex-shrink-0', className);

  const baseFallbackClasses = cn(
    'w-10 h-10 rounded-xl flex items-center justify-center bg-grey-200 text-grey-700 font-semibold text-sm flex-shrink-0',
    className,
    fallbackClassName,
  );

  if (!shouldRenderImage) {
    return (
      <div className={baseFallbackClasses} style={{ ...style, ...fallbackStyle }}>
        {fallbackText}
      </div>
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <img
      src={normalizedSrc!}
      alt={name}
      className={baseImageClasses}
      style={style}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={onError}
    />
  );
}
