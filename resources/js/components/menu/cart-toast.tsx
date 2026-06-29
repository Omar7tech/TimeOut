import { Check, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { cn } from '@/lib/utils';

/**
 * Transient "added to cart" toast. Instead of opening the whole cart on every
 * add — which interrupts browsing when building a larger order — we confirm with
 * a small toast and let the customer open the cart when they're ready.
 */
export function CartToast() {
    const { lastAdded, setOpen, count } = useCart();
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (!lastAdded) {
            return;
        }

        setTitle(lastAdded.title);
        setVisible(true);

        const timeout = window.setTimeout(() => setVisible(false), 2600);

        return () => window.clearTimeout(timeout);
    }, [lastAdded]);

    return (
        <div
            aria-live="polite"
            className={cn(
                'pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 transition-all duration-300 sm:bottom-6',
                visible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-3 opacity-0',
            )}
        >
            <div
                className={cn(
                    'flex items-center gap-2.5 rounded-full border-2 border-black bg-card px-3 py-2 shadow-[3px_3px_0_0_#000]',
                    visible && 'pointer-events-auto',
                )}
            >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
                    <Check className="size-4" />
                </span>
                <span className="max-w-[42vw] truncate text-sm font-bold sm:max-w-xs">
                    Added <span className="font-extrabold">{title}</span>
                </span>
                <button
                    type="button"
                    onClick={() => {
                        setVisible(false);
                        setOpen(true);
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-black bg-brand-red py-1 pr-1.5 pl-3 text-xs font-extrabold tracking-wide text-white uppercase transition-colors hover:bg-brand-red/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                    <ShoppingCart className="size-3.5" />
                    View
                    {count > 0 && (
                        <span className="inline-flex min-w-5 items-center justify-center rounded-full border-2 border-black bg-brand-yellow px-1 text-[11px] leading-none text-black">
                            {count > 99 ? '99+' : count}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
