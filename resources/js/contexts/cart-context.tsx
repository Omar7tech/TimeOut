import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type CartAddon = {
    name: string;
    /** Unit price of the add-on in USD. */
    price: number;
    quantity: number;
};

export type CartItem = {
    /** Unique per product + variant + add-ons combination. */
    key: string;
    productId: number;
    title: string;
    variantName: string | null;
    /** Effective (discounted) base unit price in USD, excluding add-ons. */
    unitUsd: number;
    /** Chosen optional extras; their prices are added on top of `unitUsd`. */
    addons: CartAddon[];
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
    addons?: CartAddon[];
};

/** The per-unit price of a cart line including its add-ons. */
export function cartItemUnitUsd(item: CartItem): number {
    return item.addons.reduce(
        (total, addon) => total + addon.price * addon.quantity,
        item.unitUsd,
    );
}

/** A stable signature for a set of add-ons, so identical selections share a key. */
function addonsSignature(addons: CartAddon[]): string {
    return addons
        .filter((addon) => addon.quantity > 0)
        .map((addon) => `${addon.name}x${addon.quantity}`)
        .sort()
        .join(',');
}

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

        if (!raw) {
            return [];
        }

        // Default `addons` for carts persisted before add-ons were introduced.
        return (JSON.parse(raw) as CartItem[]).map((item) => ({
            ...item,
            addons: item.addons ?? [],
        }));
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
            const addons = (input.addons ?? []).filter(
                (addon) => addon.quantity > 0,
            );
            const signature = addonsSignature(addons);
            const key = `${input.productId}:${input.variantIndex ?? 'base'}${
                signature ? `:${signature}` : ''
            }`;

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
                        addons,
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
                (total, item) =>
                    total + cartItemUnitUsd(item) * item.quantity,
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
