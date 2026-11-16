import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { cn } from '@/lib/utils';

/**
 * Transient "added" toast at the top of the screen. Instead of opening the
 * whole cart on every add, which interrupts browsing a bigger order, it
 * confirms with a small pill and lets the customer open the cart when ready.
 * The order bar at the foot of the screen carries the running total.
 */
export function CartToast() {
    const { lastAdded, setOpen } = useCart();
    // Which add has been dismissed (auto-timeout or "View"). The toast is shown
    // while the latest add hasn't been dismissed yet. Deriving visibility this
    // way keeps the effect free of synchronous setState.
    const [dismissedNonce, setDismissedNonce] = useState<number | null>(null);

    const visible = lastAdded !== null && lastAdded.nonce !== dismissedNonce;
    // `lastAdded` is never cleared, so the title stays put during the fade-out.
    const title = lastAdded?.title ?? '';

    useEffect(() => {
        if (lastAdded === null) {
            return;
        }

        const { nonce } = lastAdded;
        const timeout = window.setTimeout(
            () => setDismissedNonce(nonce),
            2200,
        );

        return () => window.clearTimeout(timeout);
    }, [lastAdded]);

    const handleView = (): void => {
        if (lastAdded !== null) {
            setDismissedNonce(lastAdded.nonce);
        }

        setOpen(true);
    };

    return (
        <div
            aria-live="polite"
            className={cn(
                'pointer-events-none fixed inset-x-0 top-[calc(4.5rem+env(safe-area-inset-top))] z-40 flex justify-center px-4 transition-[opacity,translate] duration-300 ease-out',
                visible
                    ? 'translate-y-0 opacity-100'
                    : '-translate-y-3 opacity-0',
            )}
        >
            <div
                className={cn(
                    'flex items-center gap-2.5 rounded-full bg-foreground py-1.5 ps-1.5 pe-1.5 text-background shadow-[0_16px_40px_-12px_rgb(0_0_0/0.5)]',
                    visible && 'pointer-events-auto',
                )}
            >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
                    <Check className="size-4" strokeWidth={3} />
                </span>
                <span className="max-w-[46vw] truncate text-sm sm:max-w-xs">
                    <span dir="auto" className="font-semibold">
                        {title}
                    </span>{' '}
                    <span className="opacity-70">added · انضاف</span>
                </span>
                <button
                    type="button"
                    onClick={handleView}
                    className="inline-flex min-h-9 shrink-0 items-center rounded-full bg-background/15 px-3.5 text-xs font-semibold transition-colors hover:bg-background/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                    View
                </button>
            </div>
        </div>
    );
}
