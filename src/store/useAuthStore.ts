import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        set({ user: null, isAuthenticated: false });
        // Fire-and-forget server logout to clear cookies
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/users/logout`, {
          method: 'POST',
          credentials: 'include',
        }).catch(() => {});
      },
    }),
    { name: 'bdshop-auth' }
  )
);
