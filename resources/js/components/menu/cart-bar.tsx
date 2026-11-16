import { ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { usePricing } from '@/hooks/use-pricing';
import { cn } from '@/lib/utils';

/**
 * The order bar pinned to the foot of the delivery menu once something is in
 * the cart. A solid, quiet bar in the raised ink of the theme, with the house
 * orange used once, on the item count. The label sits on two short lines
 * (English over Arabic) so it never wraps, and the total keeps to one line.
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
                'pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:pb-6',
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
                className="group pointer-events-auto mx-auto flex h-16 w-full max-w-lg items-center gap-3 rounded-2xl bg-foreground ps-2.5 pe-4 text-background shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)] transition-[scale] duration-200 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            >
                <span
                    key={count}
                    className="grid size-11 shrink-0 animate-pop place-items-center rounded-xl bg-brand-red font-display text-base font-black text-brand-ink tabular-nums"
                >
                    {count > 99 ? '99+' : count}
                </span>

                <span className="flex min-w-0 flex-1 flex-col items-start leading-tight">
                    <span className="text-sm font-semibold whitespace-nowrap">
                        View order
                    </span>
                    <span
                        lang="ar"
                        className="text-xs whitespace-nowrap opacity-60"
                    >
                        عرض الطلب
                    </span>
                </span>

                <span
                    dir="ltr"
                    className="flex shrink-0 items-baseline gap-1 whitespace-nowrap"
                >
                    <span className="font-display text-base font-extrabold tabular-nums">
                        {figure}
                    </span>
                    {currency && (
                        <span className="text-[0.625rem] font-semibold opacity-60">
                            {currency}
                        </span>
                    )}
                </span>

                <ChevronRight className="size-4 shrink-0 opacity-50 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
        </div>
    );
}
