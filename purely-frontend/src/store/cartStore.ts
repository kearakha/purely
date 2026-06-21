import { Cart } from '@/types/cart';
import { create } from 'zustand';

interface CartState {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,

  setCart: (cart) => set({ cart }),

  clearCart: () => set({ cart: null }),
}));