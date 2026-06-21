import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type CartItem = {
    /** Unique per product + variant combination. */
    key: string;
    productId: number;
    title: string;
    variantName: string | null;
    /** Effective (discounted) unit price in USD. */
    unitUsd: number;
    image: string | null;
    quantity: number;
};

export type AddToCartInput = {
    productId: number;
    variantIndex: number | null;
    title: string;
    variantName: string | null;
    unitUsd: number;
    image: string | null;
};

type CartContextValue = {
    items: CartItem[];
    count: number;
    subtotalUsd: number;
    open: boolean;
    setOpen: (open: boolean) => void;
    addItem: (input: AddToCartInput) => void;
    increment: (key: string) => void;
    decrement: (key: string) => void;
    removeItem: (key: string) => void;
    clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'timeout-cart';

function readStoredItems(): CartItem[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(readStoredItems);
    const [open, setOpen] = useState(false);

    // Persist the cart so it survives page navigations and reloads.
    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // Ignore storage failures (e.g. private mode quota).
        }
    }, [items]);

    const value = useMemo<CartContextValue>(() => {
        const addItem = (input: AddToCartInput): void => {
            const key = `${input.productId}:${input.variantIndex ?? 'base'}`;

            setItems((previous) => {
                const existing = previous.find((item) => item.key === key);

                if (existing) {
                    return previous.map((item) =>
                        item.key === key
                            ? { ...item, quantity: item.quantity + 1 }
                            : item,
                    );
                }

                return [
                    ...previous,
                    {
                        key,
                        productId: input.productId,
                        title: input.title,
                        variantName: input.variantName,
                        unitUsd: input.unitUsd,
                        image: input.image,
                        quantity: 1,
                    },
                ];
            });

            setOpen(true);
        };

        const increment = (key: string): void => {
            setItems((previous) =>
                previous.map((item) =>
                    item.key === key
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                ),
            );
        };

        const decrement = (key: string): void => {
            setItems((previous) =>
                previous
                    .map((item) =>
                        item.key === key
                            ? { ...item, quantity: item.quantity - 1 }
                            : item,
                    )
                    .filter((item) => item.quantity > 0),
            );
        };

        const removeItem = (key: string): void => {
            setItems((previous) => previous.filter((item) => item.key !== key));
        };

        const clear = (): void => setItems([]);

        return {
            items,
            count: items.reduce((total, item) => total + item.quantity, 0),
            subtotalUsd: items.reduce(
                (total, item) => total + item.unitUsd * item.quantity,
                0,
            ),
            open,
            setOpen,
            addItem,
            increment,
            decrement,
            removeItem,
            clear,
        };
    }, [items, open]);

    return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
    const context = useContext(CartContext);

    if (context === null) {
        throw new Error('useCart must be used within a CartProvider.');
    }

    return context;
}
