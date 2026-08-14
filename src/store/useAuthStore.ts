import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeAuthUser } from '../utils/auth';

export interface User {
  _id: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin' | 'superadmin';
  profileImage?: string;
  phone?: string;
  district?: string;
  division?: string;
  isActive?: boolean;
  createdAt?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null | unknown) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        const normalizedUser = normalizeAuthUser(user);
        set({ user: normalizedUser, isAuthenticated: !!normalizedUser });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        // Clear the httpOnly auth cookies using the same CSRF flow as other mutations.
        fetch(`${apiBaseUrl}/csrf-token`, { credentials: 'include' })
          .then(async (response) => {
            const body = await response.json();
            if (!response.ok || !body?.csrfToken) return;
            await fetch(`${apiBaseUrl}/users/logout`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'x-csrf-token': body.csrfToken },
            });
          })
          .catch(() => {});
      },
    }),
    {
      name: 'bdshop-auth',
      version: 1,
      migrate: (persistedState: any) => {
        const normalizedUser = normalizeAuthUser(persistedState?.user);
        return {
          ...persistedState,
          user: normalizedUser,
          isAuthenticated: !!normalizedUser,
        };
      },
    }
  )
);
