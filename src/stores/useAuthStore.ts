import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { User } from '../types/auth';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      set => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        setAuth: (user, accessToken, refreshToken) => {
          set({ user, accessToken, refreshToken });
        },
        clearAuth: () => {
          set({ user: null, accessToken: null, refreshToken: null });
        },
      }),
      {
        name: 'auth-storage',
      },
    ),
  ),
);
