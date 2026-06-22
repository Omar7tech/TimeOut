import { usePage } from '@inertiajs/react';
import { MapPin, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { OpenCountdown } from '@/components/menu/open-countdown';
import { SmartImage } from '@/components/smart-image';
import { cartItemUnitUsd, useCart } from '@/contexts/cart-context';
import { usePricing } from '@/hooks/use-pricing';
import { getBestLocation } from '@/lib/geolocation';
import type { LocationResult } from '@/lib/geolocation';
import { useShopOpen } from '@/lib/shop';
import { cn } from '@/lib/utils';
import { buildOrderMessage, buildWhatsAppUrl } from '@/lib/whatsapp-order';

const NAME_STORAGE_KEY = 'timeout-customer-name';

/** The customer name remembered from a previous order, if any. */
function readStoredName(): string {
    if (typeof window === 'undefined') {
        return '';
    }

    try {
        return window.localStorage.getItem(NAME_STORAGE_KEY) ?? '';
    } catch {
        return '';
    }
}

/** Remember the customer name so it can be pre-filled on the next order. */
function storeName(name: string): void {
    try {
        window.localStorage.setItem(NAME_STORAGE_KEY, name);
    } catch {
        // Ignore storage failures (e.g. private mode quota).
    }
}

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
    const isOpen = useShopOpen();
    const { whatsappNumber, requireFullName, getClientLocation } =
        usePage().props;
    // Single-currency formatter for the per-item breakdown rows (USD when shown,
    // otherwise LBP), keeping the breakdown compact.
    const fmtPrimary = (usd: number): string =>
        pricing.showUsd ? pricing.usd(usd) : pricing.lbp(usd);
    // Delivery is only added when there are items in the cart to deliver.
    const deliveryFeeUsd =
        items.length > 0 ? pricing.deliveryFeeUsd : null;
    const totalUsd = subtotalUsd + (deliveryFeeUsd ?? 0);
    const [confirmingClear, setConfirmingClear] = useState(false);
    // The name-entry step shown before checkout when a full name is required.
    const [enteringName, setEnteringName] = useState(false);
    const [name, setName] = useState<string>(readStoredName);
    // True while waiting on the browser's geolocation prompt.
    const [locating, setLocating] = useState(false);

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
            setEnteringName(false);
            setLocating(false);
        }
    };

    const sendOrder = (
        customerName?: string | null,
        location?: LocationResult | null,
    ): void => {
        if (!whatsappNumber || items.length === 0) {
            return;
        }

        const message = buildOrderMessage({
            items,
            pricing,
            subtotalUsd,
            deliveryFeeUsd,
            totalUsd,
            customerName,
            location,
        });

        window.open(
            buildWhatsAppUrl(whatsappNumber, message),
            '_blank',
            'noopener,noreferrer',
        );
    };

    // Resolve the customer's location (when enabled) then open WhatsApp. The order
    // is never blocked: if location is denied or unavailable, it sends without it.
    const beginSend = (customerName?: string | null): void => {
        if (!getClientLocation || !('geolocation' in navigator)) {
            sendOrder(customerName);

            return;
        }

        setLocating(true);

        getBestLocation()
            .then((location) => {
                setLocating(false);
                setEnteringName(false);
                sendOrder(customerName, location);
            })
            .catch(() => {
                // Denied or unavailable — send the order without a location.
                setLocating(false);
                setEnteringName(false);
                sendOrder(customerName, null);
            });
    };

    const handleCheckout = (): void => {
        // The shop must be open to send an order; the closed state shows a
        // countdown instead of the checkout button.
        if (!whatsappNumber || items.length === 0 || !isOpen) {
            return;
        }

        // Collect the customer's name first when the shop requires it.
        if (requireFullName) {
            setEnteringName(true);

            return;
        }

        beginSend();
    };

    const handleConfirmName = (): void => {
        const trimmed = name.trim();

        if (trimmed === '') {
            return;
        }

        storeName(trimmed);
        setName(trimmed);
        beginSend(trimmed);
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
                                    {item.image && (
                                        <SmartImage
                                            src={item.image}
                                            alt={item.title}
                                            className="size-14 shrink-0 rounded-md border-2 border-black"
                                            imgClassName="object-cover"
                                            draggable={false}
                                        />
                                    )}

                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <p className="truncate text-sm leading-tight font-bold">
                                            {item.title}
                                        </p>
                                        {item.variantName && (
                                            <p className="truncate text-xs font-semibold text-muted-foreground">
                                                {item.variantName}
                                            </p>
                                        )}
                                        {item.addons.length > 0 ? (
                                            <div className="mt-0.5 flex flex-col gap-0.5 rounded-md border border-dashed border-neutral-400 p-1.5 text-[11px] font-semibold text-muted-foreground">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span>Item</span>
                                                    <span className="tabular-nums">
                                                        {fmtPrimary(
                                                            item.unitUsd *
                                                                item.quantity,
                                                        )}
                                                    </span>
                                                </div>

                                                {item.addons.map((addon) => (
                                                    <div
                                                        key={addon.name}
                                                        className="flex items-center justify-between gap-2"
                                                    >
                                                        <span className="min-w-0 truncate">
                                                            <span className="tabular-nums">
                                                                {addon.quantity *
                                                                    item.quantity}
                                                                ×
                                                            </span>{' '}
                                                            {addon.name}
                                                        </span>
                                                        <span className="shrink-0 tabular-nums">
                                                            +
                                                            {fmtPrimary(
                                                                addon.price *
                                                                    addon.quantity *
                                                                    item.quantity,
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}

                                                <div className="mt-0.5 flex items-center justify-between gap-2 border-t border-neutral-300 pt-0.5 text-xs font-extrabold text-foreground">
                                                    <span className="tracking-wide uppercase">
                                                        Total
                                                    </span>
                                                    <span className="tabular-nums">
                                                        {fmtPrimary(
                                                            cartItemUnitUsd(
                                                                item,
                                                            ) * item.quantity,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col text-xs leading-tight font-extrabold">
                                                {pricing.showUsd && (
                                                    <span>
                                                        {pricing.usd(
                                                            item.unitUsd *
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
                                                            item.unitUsd *
                                                                item.quantity,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        )}
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
                            {deliveryFeeUsd !== null && (
                                <div className="flex flex-col gap-1.5 text-sm font-bold">
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span className="tabular-nums">
                                            {fmtPrimary(subtotalUsd)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <span>Delivery</span>
                                        <span className="tabular-nums">
                                            {fmtPrimary(deliveryFeeUsd)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
                                    {deliveryFeeUsd !== null
                                        ? 'Total'
                                        : 'Subtotal'}
                                </span>
                                <span className="flex flex-col items-end text-lg leading-tight font-black">
                                    {pricing.showUsd && (
                                        <span>{pricing.usd(totalUsd)}</span>
                                    )}
                                    {pricing.showLbp && (
                                        <span
                                            className={cn(
                                                pricing.showUsd &&
                                                    'text-sm text-muted-foreground',
                                            )}
                                        >
                                            {pricing.lbp(totalUsd)}
                                        </span>
                                    )}
                                </span>
                            </div>

                            {!isOpen ? (
                                <div className="flex flex-col gap-3 rounded-md border-2 border-dashed border-brand-red/60 p-3">
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        <p className="text-sm font-extrabold tracking-wide uppercase">
                                            We're closed
                                            <span className="text-brand-red">
                                                .
                                            </span>
                                        </p>
                                        <p className="text-xs font-semibold text-muted-foreground">
                                            Your cart is saved — order the moment
                                            we reopen.
                                        </p>
                                    </div>

                                    <OpenCountdown className="" />

                                    <button
                                        type="button"
                                        onClick={() => setConfirmingClear(true)}
                                        className="inline-flex items-center justify-center gap-1.5 self-center text-xs font-extrabold tracking-wide text-muted-foreground uppercase transition-colors hover:text-brand-red"
                                    >
                                        <Trash2 className="size-3.5" />
                                        Clear cart
                                    </button>

                                    {confirmingClear && (
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
                                    )}
                                </div>
                            ) : confirmingClear ? (
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
                            ) : enteringName ? (
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        handleConfirmName();
                                    }}
                                    className="flex flex-col gap-2 rounded-md border-2 border-dashed border-brand-red/60 p-2.5"
                                >
                                    <label
                                        htmlFor="checkout-name"
                                        className="text-sm font-extrabold tracking-wide uppercase"
                                    >
                                        Your name
                                    </label>
                                    <input
                                        id="checkout-name"
                                        type="text"
                                        autoFocus
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        placeholder="e.g. Omar"
                                        className="w-full rounded-md border-2 border-black bg-card px-3 py-2 text-sm font-bold shadow-[2px_2px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEnteringName(false)
                                            }
                                            className="inline-flex flex-1 items-center justify-center rounded-md border-2 border-black bg-card px-3 py-2 text-sm font-extrabold tracking-wide text-card-foreground uppercase shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={
                                                name.trim() === '' || locating
                                            }
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-black bg-brand-red px-3 py-2 text-sm font-extrabold tracking-wide text-white uppercase shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0_0_#000]"
                                        >
                                            {locating ? (
                                                <>
                                                    <MapPin className="size-5 animate-pulse" />
                                                    Getting location…
                                                </>
                                            ) : (
                                                <>
                                                    <img
                                                        src="/social-icons/whatsapp.svg"
                                                        alt=""
                                                        className="size-5 brightness-0 invert"
                                                    />
                                                    Send order
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
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
                                        onClick={handleCheckout}
                                        disabled={locating}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-black bg-brand-red px-3 py-2 text-sm font-extrabold tracking-wide text-white uppercase shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0_0_#000]"
                                    >
                                        {locating ? (
                                            <>
                                                <MapPin className="size-5 animate-pulse" />
                                                Getting location…
                                            </>
                                        ) : (
                                            <>
                                                <img
                                                    src="/social-icons/whatsapp.svg"
                                                    alt=""
                                                    className="size-5 brightness-0 invert"
                                                />
                                                Checkout
                                            </>
                                        )}
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
