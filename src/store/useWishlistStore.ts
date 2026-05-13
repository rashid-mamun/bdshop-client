import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  _id: string;
  name: string;
  model: string;
  price: number;
  img: string;
  category?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          if (state.items.find((i) => i._id === item._id)) return state;
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i._id !== id) })),
      toggleItem: (item) => {
        const { items } = get();
        if (items.find((i) => i._id === item._id)) {
          set((state) => ({ items: state.items.filter((i) => i._id !== item._id) }));
        } else {
          set((state) => ({ items: [...state.items, item] }));
        }
      },
      isInWishlist: (id) => get().items.some((i) => i._id === id),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'bdshop-wishlist' }
  )
);
