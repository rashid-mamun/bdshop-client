import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../services/apiClient';
import { useAuthStore } from './useAuthStore';

export interface CartItem {
  _id: string;
  name: string;
  model: string;
  price: number;
  img: string;
  quantity: number;
  description?: string;
  config?: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  fetchServerCart: () => Promise<void>;
}

const syncAddItem = async (item: CartItem) => {
  const user = useAuthStore.getState().user;
  if (!user?.email) return;
  try {
    await apiClient.post('/carts', {
      id: item._id,
      email: user.email,
      img: item.img,
      description: item.description || item.name || item.model,
      model: item.model,
      price: item.price,
      quantity: item.quantity,
      config: item.config || 'Standard',
    });
  } catch {
    // Ignore offline/guest sync errors
  }
};

const syncUpdateQuantity = async (id: string, quantity: number) => {
  const user = useAuthStore.getState().user;
  if (!user?.email) return;
  try {
    await apiClient.put(`/carts/${id}`, { quantity });
  } catch {
    // Fallback silently
  }
};

const syncRemoveItem = async (id: string) => {
  const user = useAuthStore.getState().user;
  if (!user?.email) return;
  try {
    await apiClient.delete(`/carts/${id}`);
  } catch {
    // Fallback silently
  }
};

const syncClearCart = async () => {
  const user = useAuthStore.getState().user;
  if (!user?.email) return;
  try {
    await apiClient.delete(`/carts/clear/${encodeURIComponent(user.email)}`);
  } catch {
    // Fallback silently
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      addItem: (item) => {
        const addedQuantity = Math.max(1, Number(item.quantity) || 1);
        const existingItem = get().items.find((i) => i._id === item._id);
        const updatedItem = existingItem
          ? { ...existingItem, quantity: existingItem.quantity + addedQuantity }
          : { ...item, quantity: addedQuantity };

        set((state) => {
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i._id === item._id ? { ...i, quantity: i.quantity + addedQuantity } : i
              ),
              isCartOpen: true,
            };
          }
          return { items: [...state.items, updatedItem], isCartOpen: true };
        });

        void syncAddItem(updatedItem);
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i._id !== id),
        }));
        void syncRemoveItem(id);
      },
      updateQuantity: (id, quantity) => {
        const nextQty = Math.max(1, quantity);
        set((state) => ({
          items: state.items.map((i) => (i._id === id ? { ...i, quantity: nextQty } : i)),
        }));
        void syncUpdateQuantity(id, nextQty);
      },
      clearCart: () => {
        set({ items: [] });
        void syncClearCart();
      },
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      setCartOpen: (open) => set({ isCartOpen: open }),
      fetchServerCart: async () => {
        const user = useAuthStore.getState().user;
        if (!user?.email) return;
        try {
          const res = await apiClient.get(`/carts/${encodeURIComponent(user.email)}`);
          const serverItems = res.data?.data || [];
          if (Array.isArray(serverItems) && serverItems.length > 0) {
            const mappedItems: CartItem[] = serverItems.map((si: any) => ({
              _id: si.id || si._id,
              name: si.model || si.name || 'Product',
              model: si.model || 'Product',
              price: si.price || 0,
              img: si.img || '',
              quantity: si.quantity || 1,
              description: si.description,
              config: si.config,
            }));
            set({ items: mappedItems });
          }
        } catch {
          // Keep local items if server fetch fails
        }
      },
    }),
    {
      name: 'bdshop-cart',
    }
  )
);
