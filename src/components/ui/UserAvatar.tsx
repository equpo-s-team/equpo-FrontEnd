import { getAvatarGradientClass } from '@/lib/utils/avatar/avatarBackground.ts';
import { useAvatarState } from '@/lib/utils/avatar/avatarCore.ts';
import { getInitials } from '@/lib/utils/avatar/avatarInitials.ts';
import { cn } from '@/lib/utils/utils.ts';

interface UserAvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>['referrerPolicy'];
}

export function UserAvatar({
  src,
  alt,
  className,
  fallbackClassName,
  style,
  loading = 'lazy',
  referrerPolicy = 'no-referrer',
}: UserAvatarProps) {
  const { shouldRenderImage, normalizedSrc, onError } = useAvatarState(src);
  const fallbackText = getInitials(alt);

  const baseImageClasses = cn('w-10 h-10 rounded-full object-cover flex-shrink-0', className);

  const baseFallbackClasses = cn(
    `w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`,
    getAvatarGradientClass(alt),
    className,
    fallbackClassName,
  );

  if (!shouldRenderImage) {
    return (
      <div
        className={baseFallbackClasses}
        style={style}
      >
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
