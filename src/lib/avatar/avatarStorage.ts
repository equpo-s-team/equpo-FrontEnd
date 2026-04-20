import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import log from 'loglevel';

import { storage } from '@/firebase';
import { request } from '@/lib/api/core.ts';

const USER_PROFILE_AVATAR_PATH = (uid: string): string => `users/${uid}/profile`;

const isStorageAvatarUrl = (url: string): boolean => {
  return url.includes('firebasestorage.googleapis.com') || url.includes('/o/users%2F');
};

const isExternalAvatarUrl = (url: string): boolean => {
  if (!url) {
    return false;
  }

  if (isStorageAvatarUrl(url)) {
    return false;
  }

  return /^https?:\/\//i.test(url);
};

const isGoogleAvatarUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return /^lh[3-6]\.googleusercontent\.com$/i.test(parsedUrl.hostname);
  } catch {
    return false;
  }
};

const mirrorAvatarViaBackend = async (sourceUrl: string): Promise<string | null> => {
  try {
    const payload = await request<{ photoURL?: string }>('/users/me/avatar/mirror', 'POST', {
      sourceUrl,
    });

    return payload.photoURL ?? null;
  } catch (error) {
    log.warn('No se pudo espejar avatar externo via backend.', error);
    return null;
  }
};

const toSafeImageBlob = async (sourceUrl: string): Promise<Blob | null> => {
  const response = await fetch(sourceUrl, { cache: 'no-store' });

  if (!response.ok) {
    return null;
  }

  const blob = await response.blob();

  if (!blob.type.startsWith('image/')) {
    return null;
  }

  return blob;
};

export const uploadUserProfileBlob = async (uid: string, blob: Blob): Promise<string> => {
  const profileImageRef = ref(storage, USER_PROFILE_AVATAR_PATH(uid));

  await uploadBytes(profileImageRef, blob, {
    contentType: blob.type || 'image/jpeg',
  });

  return getDownloadURL(profileImageRef);
};

export const uploadUserProfileFile = async (uid: string, file: File): Promise<string> => {
  return uploadUserProfileBlob(uid, file);
};

export const resolveCanonicalAvatarUrl = async (
  uid: string,
  rawPhotoUrl?: string | null,
): Promise<string | null> => {
  const photoUrl = rawPhotoUrl?.trim();

  if (!photoUrl) {
    return null;
  }

  if (!isExternalAvatarUrl(photoUrl)) {
    return photoUrl;
  }

  try {
    const avatarBlob = await toSafeImageBlob(photoUrl);

    if (avatarBlob) {
      return await uploadUserProfileBlob(uid, avatarBlob);
    }
  } catch (error) {
    log.warn('No se pudo copiar avatar externo a Storage. Se conserva URL original.', error);
  }

  if (isGoogleAvatarUrl(photoUrl)) {
    const mirroredPhotoUrl = await mirrorAvatarViaBackend(photoUrl);
    if (mirroredPhotoUrl) {
      return mirroredPhotoUrl;
    }
  }

  return photoUrl;
};

