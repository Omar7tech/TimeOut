import { ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { usePricing } from '@/hooks/use-pricing';
import { cn } from '@/lib/utils';

/**
 * The order bar pinned to the foot of the delivery menu once something is in
 * the cart: a frosted bar in the page's own surface, the item count and
 * "Your order" on one side, and on the other a single orange button carrying
 * the total, the one place the house colour is used. No glow, no badge.
 */
export function CartBar() {
    const { count, subtotalUsd, setOpen } = useCart();
    const pricing = usePricing();
    const visible = count > 0;

    // "8,170,000 LBP" → figure and currency, so the label can be set smaller.
    const total = pricing.primary(subtotalUsd);
    const [figure, currency] = total.endsWith(' LBP')
        ? [total.slice(0, -4), 'LBP']
        : [total, ''];

    return (
        <div
            className={cn(
                'pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:pb-5',
                visible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-full opacity-0',
            )}
        >
            <div
                aria-hidden={!visible}
                className="pointer-events-auto mx-auto flex h-[4.25rem] w-full max-w-lg items-center gap-3 rounded-[1.375rem] bg-card/90 ps-4 pe-2 shadow-[0_12px_32px_-16px_rgb(0_0_0/0.6)] ring-1 ring-border backdrop-blur-xl"
            >
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="text-sm font-semibold whitespace-nowrap">
                        Your order
                        <span lang="ar" className="ms-1.5 font-normal text-muted-foreground">
                            · طلبك
                        </span>
                    </span>
                    <span className="text-xs whitespace-nowrap text-muted-foreground tabular-nums">
                        {count} {count === 1 ? 'item' : 'items'}
                    </span>
                </span>

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    tabIndex={visible ? 0 : -1}
                    className="group flex h-[3.25rem] shrink-0 items-center gap-2.5 rounded-2xl bg-brand-red ps-4 pe-3 text-brand-ink transition-[scale,background-color] duration-200 hover:bg-brand-red/90 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
                >
                    <span dir="ltr" className="flex items-baseline gap-1 whitespace-nowrap">
                        <span className="font-display text-[0.9375rem] font-extrabold tabular-nums">
                            {figure}
                        </span>
                        {currency && (
                            <span className="text-[0.625rem] font-bold opacity-70">
                                {currency}
                            </span>
                        )}
                    </span>
                    <span className="sr-only">View order</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
            </div>
        </div>
    );
}
