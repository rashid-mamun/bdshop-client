import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductPreview } from '../types/product';

interface CompareStore {
  items: ProductPreview[];
  toggleItem: (item: ProductPreview) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) =>
        set((state) => {
          if (state.items.some((p) => p._id === item._id)) {
            return { items: state.items.filter((p) => p._id !== item._id) };
          }
          return { items: [...state.items.slice(-2), item] };
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((p) => p._id !== id) })),
      clear: () => set({ items: [] }),
      isInCompare: (id) => get().items.some((p) => p._id === id),
    }),
    { name: 'bdshop-compare' }
  )
);
