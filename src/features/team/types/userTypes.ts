export type UpdateUserProfileInput = {
  uid: string;
  displayName: string;
  photoURL: string | null;
  photoFile?: File | null;
};

export type UpdateUserProfileResult = {
  displayName: string;
  photoURL: string | null;
};

export type GeneratedDataConnectModule = {
  updateUserProfile?: (vars: {
    displayName: string;
    photoURL: string | null;
  }) => Promise<unknown>;
};

export type UserProfileSaveInput = {
  displayName: string;
  photoURL: string | null;
  photoFile?: File | null;
};
