import {getAvatarGradientClass} from "@/lib/utils/avatar/avatarBackground.ts";
import { useAvatarState } from '@/lib/utils/avatar/avatarCore.ts';
import { getInitials } from '@/lib/utils/avatar/avatarInitials.ts';
import { cn } from '@/lib/utils/utils.ts';

interface TeamAvatarProps {
  src?: string | null;
  name: string;
  className?: string;
  fallbackClassName?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
}

export function TeamAvatar({
  src,
  name,
  className,
  fallbackClassName,
  style,
  loading = 'lazy',
}: TeamAvatarProps) {
  const { shouldRenderImage, normalizedSrc, onError } = useAvatarState(src);
  const fallbackText = getInitials(name, 'EQ');

  const baseImageClasses = cn('w-10 h-10 rounded-xl object-cover flex-shrink-0', className);

  const baseFallbackClasses = cn(
    `w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`,
    getAvatarGradientClass(name),
    className,
    fallbackClassName,
  );

  if (!shouldRenderImage) {
    return (
      <div className={baseFallbackClasses} style={{ ...style }}>
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
