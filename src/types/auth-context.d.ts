declare module '@/context/AuthContext' {
  export interface AuthContextUser {
    uid: string;
  }

  export interface AuthContextValue {
    user: AuthContextUser | null;
    isAuth: boolean;
    isLoading: boolean;
  }

  export function useAuth(): AuthContextValue;
}

