import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductPreview } from '../types/product';

interface RecentlyViewedStore {
  items: ProductPreview[];
  addItem: (item: ProductPreview) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [item, ...state.items.filter((p) => p._id !== item._id)].slice(0, 8),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'bdshop-recently-viewed' }
  )
);
