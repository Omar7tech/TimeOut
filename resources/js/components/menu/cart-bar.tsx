import { useCart } from '@/contexts/cart-context';
import { usePricing } from '@/hooks/use-pricing';
import { cn } from '@/lib/utils';

/**
 * The order bar pinned to the foot of the delivery menu once something is in
 * the cart. Three things, given room: how many items, "View order", and the
 * total. It sits on a fade of the page so the menu never shows through it
 * half-hidden, and rises in with the first item.
 */
export function CartBar() {
    const { count, subtotalUsd, setOpen } = useCart();
    const pricing = usePricing();
    const visible = count > 0;

    return (
        <div
            className={cn(
                'pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background via-background/90 to-transparent px-4 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))] transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:pb-6',
                visible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-full opacity-0',
            )}
        >
            <button
                type="button"
                onClick={() => setOpen(true)}
                tabIndex={visible ? 0 : -1}
                aria-hidden={!visible}
                className="pointer-events-auto mx-auto flex h-16 w-full max-w-lg items-center gap-4 rounded-2xl bg-brand-red px-5 text-brand-ink shadow-[0_16px_36px_-14px_rgb(255_102_0/0.7)] transition-[scale,background-color] duration-200 hover:bg-brand-red/95 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            >
                <span
                    key={count}
                    className="grid h-8 min-w-8 animate-pop place-items-center rounded-lg bg-brand-ink px-2 font-display text-sm font-bold text-brand-red tabular-nums"
                >
                    {count > 99 ? '99+' : count}
                </span>
                <span className="flex-1 text-start text-base font-semibold">
                    View order
                    <span className="ms-2 font-medium opacity-60">
                        عرض الطلب
                    </span>
                </span>
                <span className="font-display text-lg font-extrabold tabular-nums">
                    {pricing.primary(subtotalUsd)}
                </span>
            </button>
        </div>
    );
}
