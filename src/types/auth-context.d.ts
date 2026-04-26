declare module '@/context/AuthContext' {
  export interface AuthContextUser {
    uid: string;
    virtualCurrency?: number;
    experiencePoints?: number;
    level?: number;
  }

  export interface AuthContextValue {
    user: AuthContextUser | null;
    isAuth: boolean;
    isLoading: boolean;
    updateUserData: (data: Partial<AuthContextUser>) => void;
  }

  export function useAuth(): AuthContextValue;
}
