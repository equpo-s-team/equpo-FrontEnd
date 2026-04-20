import { useAvatarState } from '@/lib/avatar/avatarCore.ts';
import { getInitials } from '@/lib/avatar/avatarInitials.ts';
import { cn } from '@/lib/utils.ts';

interface UserAvatarProps {
  src?: string | null;
  alt: string;
  initials?: string;
  className?: string;
  fallbackClassName?: string;
  style?: React.CSSProperties;
  fallbackStyle?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>['referrerPolicy'];
}

export function UserAvatar({
  src,
  alt,
  initials,
  className,
  fallbackClassName,
  style,
  fallbackStyle,
  loading = 'lazy',
  referrerPolicy = 'no-referrer',
}: UserAvatarProps) {
  const { shouldRenderImage, normalizedSrc, onError } = useAvatarState(src);
  const fallbackText = initials?.trim() || getInitials(alt);

  const baseImageClasses = cn('w-10 h-10 rounded-full object-cover flex-shrink-0', className);

  const baseFallbackClasses = cn(
    'w-10 h-10 rounded-full flex items-center justify-center bg-grey-200 text-grey-700 font-semibold text-sm flex-shrink-0',
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
      alt={alt}
      className={baseImageClasses}
      style={style}
      loading={loading}
      decoding="async"
      referrerPolicy={referrerPolicy}
      onError={onError}
    />
  );
}
