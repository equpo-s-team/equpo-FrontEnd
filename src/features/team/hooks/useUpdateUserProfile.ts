import { updateProfile } from 'firebase/auth';

import { uploadUserProfileFile } from '@/components/ui/avatar/avatarStorage';
import {
  type GeneratedDataConnectModule,
  type UpdateUserProfileInput,
  type UpdateUserProfileResult,
} from '@/features/team/types/userTypes.ts';
import { auth } from '@/firebase';

let isUpdateUserProfileUnavailable = false;

const uploadProfileImage = async (uid: string, photoFile: File): Promise<string> => {
  return uploadUserProfileFile(uid, photoFile);
};

const isMissingUpdateOperationError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('operation "updateuserprofile" not found') || message.includes('"code":404')
    );
  }

  return false;
};

const applyAuthFallback = async (displayName: string, photoURL: string | null): Promise<void> => {
  if (!auth.currentUser) {
    return;
  }

  await updateProfile(auth.currentUser, {
    displayName,
    photoURL,
  });
};

export const useUpdateUserProfile = () => {
  const saveProfile = async ({
    uid,
    displayName,
    photoURL,
    photoFile,
  }: UpdateUserProfileInput): Promise<UpdateUserProfileResult> => {
    const resolvedPhotoURL = photoFile ? await uploadProfileImage(uid, photoFile) : photoURL;

    if (isUpdateUserProfileUnavailable) {
      await applyAuthFallback(displayName, resolvedPhotoURL);
      return {
        displayName,
        photoURL: resolvedPhotoURL,
      };
    }

    const generatedModule = (await import('@/dataconnect-generated')) as GeneratedDataConnectModule;

    if (!generatedModule.updateUserProfile) {
      isUpdateUserProfileUnavailable = true;
      await applyAuthFallback(displayName, resolvedPhotoURL);
      return {
        displayName,
        photoURL: resolvedPhotoURL,
      };
    }

    try {
      await generatedModule.updateUserProfile({
        displayName,
        photoURL: resolvedPhotoURL,
      });
      await applyAuthFallback(displayName, resolvedPhotoURL);
    } catch (error) {
      if (!isMissingUpdateOperationError(error)) {
        throw error;
      }

      isUpdateUserProfileUnavailable = true;
      await applyAuthFallback(displayName, resolvedPhotoURL);
    }

    return {
      displayName,
      photoURL: resolvedPhotoURL,
    };
  };

  return {
    saveProfile,
  };
};
