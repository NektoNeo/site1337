'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ConfiguratorSelection } from '@/types/configurator';

/**
 * Cart item representing a product in the shopping cart
 */
export interface CartItem {
  id: string;
  name: string;
  specs: string;
  price: number;
  quantity: number;
  image: string;
  slug?: string;
  /**
   * Optional metadata for non-standard items (e.g. configurator results).
   * Existing UI can ignore this safely.
   */
  kind?: 'product' | 'configurator';
  configurator?: {
    variantId: string;
    vkProductId: string;
    selection: ConfiguratorSelection;
    vkUrl?: string;
  };
}

/**
 * Customer order information
 */
export interface OrderInfo {
  name: string;
  phone: string;
  email: string;
  contactMethod: 'phone' | 'telegram' | 'whatsapp';
  comments?: string;
}

/**
 * Order submission result
 */
export interface OrderResult {
  success: boolean;
  orderNumber?: string;
  error?: string;
}

/**
 * Cart store state and actions
 */
interface CartState {
  items: CartItem[];
  isHydrated: boolean;
}

interface CartActions {
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  addConfiguredItem: (payload: {
    variantId: string;
    variantName: string;
    vkProductId: string;
    selection: ConfiguratorSelection;
    price: number;
    image: string;
    specs?: string;
    vkUrl?: string;
  }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setHydrated: () => void;
}

interface CartGetters {
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemById: (id: string) => CartItem | undefined;
  isEmpty: () => boolean;
}

type CartStore = CartState & CartActions & CartGetters;

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VA-${timestamp}${random}`;
}

/**
 * Zustand cart store with localStorage persistence
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isHydrated: false,

      // Actions
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          
          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },

      addConfiguredItem: (payload) => {
        const id =
          `cfg:${payload.variantId}` +
          `:${payload.selection.tier}` +
          `:${payload.selection.caseModel}` +
          `:${payload.selection.caseColor}` +
          `:${payload.selection.sidePanel}` +
          `:${payload.selection.rgb}`;

        get().addItem({
          id,
          name: payload.variantName,
          specs:
            payload.specs ??
            `Корпус: ${payload.selection.caseModel}, цвет: ${payload.selection.caseColor}, панель: ${payload.selection.sidePanel}, RGB: ${payload.selection.rgb}`,
          price: payload.price,
          image: payload.image,
          kind: 'configurator',
          configurator: {
            variantId: payload.variantId,
            vkProductId: payload.vkProductId,
            selection: payload.selection,
            vkUrl: payload.vkUrl,
          },
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },

      // Getters
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemById: (id) => {
        return get().items.find((item) => item.id === id);
      },

      isEmpty: () => {
        return get().items.length === 0;
      },
    }),
    {
      name: 'vapc-cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/**
 * Format price in Russian rubles
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price without currency symbol
 */
export function formatPriceCompact(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price);
}
