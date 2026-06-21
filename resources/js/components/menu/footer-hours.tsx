import { Clock } from 'lucide-react';
import { formatTime, isShopOpen, useShop, weeklyHours } from '@/lib/shop';
import { cn } from '@/lib/utils';

/**
 * Weekly opening-hours card for the footer, shown only when the shop runs on the
 * automatic schedule. Consecutive days with the same hours are merged into ranges,
 * today's row is highlighted, and a live "Open now / Closed" badge sits on top.
 */
export function FooterHours() {
    const shop = useShop();

    if (shop.statusMode !== 'automatic') {
        return null;
    }

    const rows = weeklyHours(shop);
    const open = isShopOpen(shop);

    return (
        <div>
            <h3 className="mb-3 flex items-baseline gap-2 text-xs font-black tracking-widest uppercase">
                <span className="text-brand-red">Hours</span>
                <span className="text-foreground/30">/</span>
                <span
                    className={cn(
                        open ? 'text-foreground' : 'text-muted-foreground',
                    )}
                >
                    {open ? 'Open' : 'Closed'}
                </span>
            </h3>

            <ul className="flex flex-col gap-1">
                {rows.map((row) => (
                    <li
                        key={row.label}
                        className={cn(
                            'flex items-center justify-between gap-6 rounded-md px-2 py-1 text-sm font-bold tracking-wide',
                            row.isToday
                                ? 'bg-foreground/5 text-foreground'
                                : 'text-foreground/70',
                        )}
                    >
                        <span className="flex items-center gap-1.5 uppercase">
                            {row.isToday && (
                                <Clock className="size-3.5 text-brand-red" />
                            )}
                            {row.label}
                        </span>
                        {row.isClosed ? (
                            <span className="font-extrabold text-brand-red uppercase">
                                Closed
                            </span>
                        ) : (
                            <span className="tabular-nums">
                                {formatTime(row.opensAt)} –{' '}
                                {formatTime(row.closesAt)}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
