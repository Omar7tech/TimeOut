import { BrandSpark } from '@/components/brand-spark';
import { OrderTypeSwitch } from '@/components/menu/order-type-switch';
import type { OrderType } from '@/types';

interface MenuMastheadProps {
    orderType: OrderType;
}

/**
 * The top of the menu, kept compact: which menu this is (a small English label
 * over the Arabic title, on one line) and the switch to the other menu. It enters
 * once on load.
 */
export function MenuMasthead({ orderType }: MenuMastheadProps) {
    const delivery = orderType === 'takeaway';

    return (
        <section
            dir="rtl"
            className="flex animate-rise flex-col gap-4 pt-2 md:flex-row md:items-end md:justify-between"
        >
            <div className="flex items-end justify-between gap-4 md:justify-start md:gap-6">
                <div className="flex min-w-0 flex-col gap-1">
                    <p
                        dir="ltr"
                        className="flex items-center gap-2 self-end text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase"
                    >
                        <BrandSpark className="size-4" />
                        {delivery ? 'Delivery menu' : 'Dine-in menu'}
                    </p>
                    <h1
                        lang="ar"
                        dir="rtl"
                        className="font-display text-[clamp(1.875rem,1.4rem+2vw,2.75rem)] leading-tight font-black whitespace-nowrap"
                    >
                        {delivery ? 'منيو التوصيل' : 'منيو المحل'}
                    </h1>
                </div>
            </div>

            <OrderTypeSwitch
                current={orderType}
                className="w-full md:w-96 md:shrink-0"
                dir="ltr"
            />
        </section>
    );
}
