import { create } from 'zustand';
import { toUserFriendlyError } from '../utils/userFriendlyError';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).slice(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function useToast() {
  const { toasts, addToast, removeToast } = useToastStore();
  return {
    toasts,
    removeToast,
    toast: (message: string, type?: 'success' | 'error' | 'info') => addToast(message, type),
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(toUserFriendlyError(message), 'error'),
    info: (message: string) => addToast(message, 'info'),
  };
}
