import { BrandSpark } from '@/components/brand-spark';
import { OrderTypeSwitch } from '@/components/menu/order-type-switch';
import type { OrderType } from '@/types';

interface MenuMastheadProps {
    orderType: OrderType;
    itemCount: number;
    categoryCount: number;
}

/**
 * The top of the menu: which menu this is, in Arabic first and English under
 * it, the size of the menu as a plain fact, and the switch to the other menu.
 * It enters once on load.
 */
export function MenuMasthead({
    orderType,
    itemCount,
    categoryCount,
}: MenuMastheadProps) {
    const delivery = orderType === 'takeaway';

    return (
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-surface px-5 pt-7 pb-5 md:px-8 md:pt-10 md:pb-7">

            <div className="flex animate-rise items-center gap-3">
                <BrandSpark />
                <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Time Out Snack · عاليه
                </p>
            </div>

            <h1 className="mt-4 flex flex-col gap-1">
                <span
                    lang="ar"
                    dir="rtl"
                    className="animate-rise self-start font-display text-[clamp(2.5rem,1.6rem+4.5vw,4.5rem)] leading-[1.05] font-black [animation-delay:80ms]"
                >
                    {delivery ? 'منيو التوصيل' : 'منيو المحل'}
                </span>
                <span className="animate-rise font-display text-[clamp(1.125rem,0.9rem+1vw,1.625rem)] leading-tight font-bold text-muted-foreground [animation-delay:140ms]">
                    {delivery ? 'Delivery menu' : 'Dine-in menu'}
                </span>
            </h1>

            <p className="mt-4 flex animate-rise flex-wrap items-center gap-x-3 gap-y-1 text-sm [animation-delay:200ms]">
                <span className="font-medium">
                    <span className="font-display font-extrabold tabular-nums">
                        {itemCount}
                    </span>{' '}
                    dishes ·{' '}
                    <span className="font-display font-extrabold tabular-nums">
                        {categoryCount}
                    </span>{' '}
                    sections
                </span>
                <span aria-hidden className="text-muted-foreground">/</span>
                <span lang="ar" dir="rtl" className="text-muted-foreground">
                    {itemCount} صنف · {categoryCount} أقسام
                </span>
            </p>

            <OrderTypeSwitch
                current={orderType}
                className="mt-6 animate-rise [animation-delay:260ms] md:max-w-md"
            />
        </section>
    );
}
