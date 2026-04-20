import { useEffect, useMemo, useState } from 'react';

import { getInitials } from '@/lib/avatar/avatarInitials.ts';

const failedAvatarUrls = new Set<string>();

const normalizeAvatarUrl = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

interface UserAvatarProps {
  src?: string | null;
  alt: string;
  initials?: string;
  className: string;
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
  fallbackClassName = '',
  style,
  fallbackStyle,
  loading = 'lazy',
  referrerPolicy = 'no-referrer',
}: UserAvatarProps) {
  const normalizedSrc = useMemo(() => normalizeAvatarUrl(src), [src]);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    setHasLoadError(false);
  }, [normalizedSrc]);

  const shouldRenderImage =
    !!normalizedSrc && !hasLoadError && !failedAvatarUrls.has(normalizedSrc);

  const fallbackText = initials?.trim() || getInitials(alt);

  if (!shouldRenderImage) {
    return (
      <div className={`${className} ${fallbackClassName}`.trim()} style={{ ...style, ...fallbackStyle }}>
        {fallbackText}
      </div>
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <img
      src={normalizedSrc}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding="async"
      referrerPolicy={referrerPolicy}
      onError={() => {
        failedAvatarUrls.add(normalizedSrc);
        setHasLoadError(true);
      }}
    />
  );
}


