import type { User } from 'firebase/auth';

export declare function useAuth(): {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
};
