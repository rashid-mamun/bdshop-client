import type { User } from '../store/useAuthStore';

type AuthPayload =
  | User
  | null
  | undefined
  | {
      user?: User;
      data?: User | { user?: User };
    };

export const normalizeAuthUser = (payload: AuthPayload | unknown): User | null => {
  const value = payload as any;
  const candidate = value?.data?.user ?? value?.data ?? value?.user ?? value;

  if (!candidate || typeof candidate !== 'object' || !candidate.email) {
    return null;
  }

  return candidate as User;
};

export const isAdminUser = (payload: AuthPayload | unknown): boolean => {
  const user = normalizeAuthUser(payload);
  return user?.role === 'admin' || user?.role === 'superadmin';
};

export const getRouteFromLocationState = (state: unknown): string | undefined => {
  const from = (state as any)?.from;
  if (!from?.pathname) return undefined;
  return `${from.pathname}${from.search || ''}${from.hash || ''}`;
};

export const getPostAuthRedirect = (user: User, from?: string): string => {
  const blockedAuthRoutes = new Set(['/login', '/register', '/forgot-password']);
  if (from && from !== '/' && !blockedAuthRoutes.has(from)) {
    return from;
  }

  return isAdminUser(user) ? '/dashboard' : '/my-account';
};
