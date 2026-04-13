import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    _id: string; // Product ID
    name: string;
    price: number;
    image: string;
    slug: string;
    quantity: number;
    stock?: number;
    selected?: boolean; // For checkout selection
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity' | 'selected'> & { quantity?: number; selected?: boolean }) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    toggleItemSelection: (id: string) => void;
    selectAllItems: () => void;
    deselectAllItems: () => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    getSelectedPrice: () => number;
    getSelectedItems: () => CartItem[];
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i._id === item._id);
                const stockLimit = item.stock ?? existingItem?.stock ?? Infinity;
                const desiredQuantity = item.quantity ?? 1;
                const shouldSelect = item.selected !== false; // Default to true unless explicitly false

                if (stockLimit !== Infinity && stockLimit <= 0) {
                    return;
                }

                if (existingItem) {
                    const nextQuantity = existingItem.quantity + desiredQuantity;
                    if (stockLimit !== Infinity && nextQuantity > stockLimit) {
                        set({
                            items: currentItems.map((i) =>
                                i._id === item._id ? { ...i, quantity: stockLimit, stock: stockLimit } : i
                            ),
                        });
                    } else {
                        set({
                            items: currentItems.map((i) =>
                                i._id === item._id ? { ...i, quantity: nextQuantity, stock: stockLimit } : i
                            ),
                        });
                    }
                } else {
                    const finalQuantity = stockLimit !== Infinity ? Math.min(desiredQuantity, stockLimit) : desiredQuantity;
                    if (finalQuantity <= 0) return;
                    set({ items: [...currentItems, { ...item, quantity: finalQuantity, stock: stockLimit, selected: shouldSelect }] });
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((i) => i._id !== id) });
            },
            updateQuantity: (id, quantity) => {
                const existingItem = get().items.find((i) => i._id === id);
                if (!existingItem) return;
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }
                if (existingItem.stock !== undefined && quantity > existingItem.stock) {
                    return;
                }
                set({
                    items: get().items.map((i) => (i._id === id ? { ...i, quantity } : i)),
                });
            },
            toggleItemSelection: (id) => {
                set({
                    items: get().items.map((i) => (i._id === id ? { ...i, selected: !i.selected } : i)),
                });
            },
            selectAllItems: () => {
                set({
                    items: get().items.map((i) => ({ ...i, selected: true })),
                });
            },
            deselectAllItems: () => {
                set({
                    items: get().items.map((i) => ({ ...i, selected: false })),
                });
            },
            clearCart: () => set({ items: [] }),
            getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
            getSelectedPrice: () => get().items.reduce((total, item) => item.selected ? total + item.price * item.quantity : total, 0),
            getSelectedItems: () => get().items.filter((i) => i.selected),
        }),
        {
            name: 'snackhub-cart', // key in local storage
        }
    )
);
