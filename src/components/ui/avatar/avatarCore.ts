import { useEffect, useMemo, useState } from 'react';

/**
 * Module-level cache of URLs that failed to load.
 * Shared across UserAvatar, TeamAvatar and GroupAvatar so a URL that
 * already failed in one place won't be retried in another.
 */
export const failedAvatarUrls = new Set<string>();

export const normalizeAvatarUrl = (value?: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

interface AvatarState {
  shouldRenderImage: boolean;
  normalizedSrc: string | null;
  onError: () => void;
}

/**
 * Shared hook used by all avatar components.
 * Handles URL normalization, per-session error state, and the global
 * failed-URL cache so a broken image is never retried.
 */
export function useAvatarState(src?: string | null): AvatarState {
  const normalizedSrc = useMemo(() => normalizeAvatarUrl(src), [src]);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    setHasLoadError(false);
  }, [normalizedSrc]);

  const shouldRenderImage =
    !!normalizedSrc && !hasLoadError && !failedAvatarUrls.has(normalizedSrc);

  const onError = () => {
    if (normalizedSrc) failedAvatarUrls.add(normalizedSrc);
    setHasLoadError(true);
  };

  return { shouldRenderImage, normalizedSrc, onError };
}
