import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { getInitials } from '@/lib/avatar/avatarInitials.ts';

interface TeamAvatarProps {
  src?: string | null;
  name: string;
  className: string;
  fallbackClassName?: string;
  style?: React.CSSProperties;
  fallbackStyle?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
}

export function TeamAvatar({
  src,
  name,
  className,
  fallbackClassName = '',
  style,
  fallbackStyle,
  loading = 'lazy',
}: TeamAvatarProps) {
  return (
    <UserAvatar
      src={src}
      alt={name}
      initials={getInitials(name, 'EQ')}
      className={className}
      fallbackClassName={fallbackClassName}
      style={style}
      fallbackStyle={fallbackStyle}
      loading={loading}
    />
  );
}

