import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cartItemUnitUsd, useCart } from '@/contexts/cart-context';
import { usePricing } from '@/hooks/use-pricing';
import { cn } from '@/lib/utils';

/**
 * Responsive cart: a bottom sheet on mobile and a centered modal on desktop.
 * Lists items with quantity steppers and a currency-aware subtotal.
 */
export function CartSheet() {
    const {
        items,
        open,
        setOpen,
        count,
        subtotalUsd,
        increment,
        decrement,
        removeItem,
        clear,
    } = useCart();
    const pricing = usePricing();
    const [confirmingClear, setConfirmingClear] = useState(false);

    // Auto-dismiss the clear confirmation after a few seconds.
    useEffect(() => {
        if (!confirmingClear) {
            return;
        }

        const timeout = window.setTimeout(
            () => setConfirmingClear(false),
            4000,
        );

        return () => window.clearTimeout(timeout);
    }, [confirmingClear]);

    const handleOpenChange = (next: boolean): void => {
        setOpen(next);

        if (!next) {
            setConfirmingClear(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="gap-0 p-0">
                <DialogHeader className="border-b-2 border-neutral-700 p-4 pr-12">
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="size-5" />
                        Your cart
                        {count > 0 && (
                            <span className="rounded-full bg-brand-red px-2 py-0.5 text-xs font-extrabold text-white">
                                {count}
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                        <ShoppingCart className="size-10 text-muted-foreground/40" />
                        <p className="font-bold">Your cart is empty</p>
                        <p className="text-sm text-muted-foreground">
                            Add some items to get started.
                        </p>
                    </div>
                ) : (
                    <>
                        <ul className="flex max-h-[50vh] flex-col divide-y-2 divide-neutral-700 overflow-y-auto">
                            {items.map((item) => (
                                <li
                                    key={item.key}
                                    className="flex items-center gap-3 p-3"
                                >
                                    <div className="size-14 shrink-0 overflow-hidden rounded-md border-2 border-black">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="size-full object-cover"
                                                draggable={false}
                                            />
                                        ) : (
                                            <div className="size-full bg-muted" />
                                        )}
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <p className="truncate text-sm leading-tight font-bold">
                                            {item.title}
                                        </p>
                                        {item.variantName && (
                                            <p className="truncate text-xs font-semibold text-muted-foreground">
                                                {item.variantName}
                                            </p>
                                        )}
                                        {item.addons.length > 0 && (
                                            <ul className="flex flex-wrap gap-1">
                                                {item.addons.map((addon) => (
                                                    <li
                                                        key={addon.name}
                                                        className="inline-flex items-center gap-1 rounded border border-black bg-brand-yellow px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-black uppercase"
                                                    >
                                                        <span className="tabular-nums">
                                                            {addon.quantity}×
                                                        </span>
                                                        <span className="max-w-[8rem] truncate normal-case">
                                                            {addon.name}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <div className="flex flex-col text-xs leading-tight font-extrabold">
                                            {pricing.showUsd && (
                                                <span>
                                                    {pricing.usd(
                                                        cartItemUnitUsd(item) *
                                                            item.quantity,
                                                    )}
                                                </span>
                                            )}
                                            {pricing.showLbp && (
                                                <span
                                                    className={cn(
                                                        pricing.showUsd &&
                                                            'text-[11px] text-muted-foreground',
                                                    )}
                                                >
                                                    {pricing.lbp(
                                                        cartItemUnitUsd(item) *
                                                            item.quantity,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.key)}
                                            aria-label={`Remove ${item.title}`}
                                            className="text-muted-foreground transition-colors hover:text-brand-red"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>

                                        <div className="flex items-center overflow-hidden rounded-md border-2 border-black">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decrement(item.key)
                                                }
                                                aria-label="Decrease quantity"
                                                className="flex size-7 items-center justify-center bg-card transition-colors hover:bg-muted"
                                            >
                                                <Minus className="size-3.5" />
                                            </button>
                                            <span className="w-7 text-center text-sm font-extrabold tabular-nums">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    increment(item.key)
                                                }
                                                aria-label="Increase quantity"
                                                className="flex size-7 items-center justify-center bg-card transition-colors hover:bg-muted"
                                            >
                                                <Plus className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col gap-3 border-t-2 border-neutral-700 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
                                    Subtotal
                                </span>
                                <span className="flex flex-col items-end text-lg leading-tight font-black">
                                    {pricing.showUsd && (
                                        <span>{pricing.usd(subtotalUsd)}</span>
                                    )}
                                    {pricing.showLbp && (
                                        <span
                                            className={cn(
                                                pricing.showUsd &&
                                                    'text-sm text-muted-foreground',
                                            )}
                                        >
                                            {pricing.lbp(subtotalUsd)}
                                        </span>
                                    )}
                                </span>
                            </div>

                            {confirmingClear ? (
                                <div className="flex flex-col gap-2 rounded-md border-2 border-dashed border-brand-red/60 p-2.5">
                                    <p className="text-center text-sm font-bold">
                                        Clear all items from your cart?
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setConfirmingClear(false)
                                            }
                                            className="inline-flex flex-1 items-center justify-center rounded-md border-2 border-black bg-card px-3 py-2 text-sm font-extrabold tracking-wide text-card-foreground uppercase shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                clear();
                                                setConfirmingClear(false);
                                            }}
                                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border-2 border-black bg-brand-red px-3 py-2 text-sm font-extrabold tracking-wide text-white uppercase shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        >
                                            <Trash2 className="size-4" />
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setConfirmingClear(true)}
                                        aria-label="Clear cart"
                                        className="inline-flex items-center justify-center rounded-md border-2 border-black bg-card px-3 py-2 text-sm font-extrabold tracking-wide text-card-foreground uppercase shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex flex-1 items-center justify-center rounded-md border-2 border-black bg-brand-red px-3 py-2 text-sm font-extrabold tracking-wide text-white uppercase shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
