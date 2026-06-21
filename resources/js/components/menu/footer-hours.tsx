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
            <div className="mb-3 flex items-center gap-2">
                <h3 className="text-xs font-black tracking-widest text-brand-red uppercase">
                    Hours
                </h3>
                <span
                    className={cn(
                        'inline-flex items-center gap-1 rounded-full border border-black px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase',
                        open
                            ? 'bg-brand-yellow text-black'
                            : 'bg-foreground/10 text-muted-foreground',
                    )}
                >
                    <span
                        className={cn(
                            'size-1.5 rounded-full',
                            open ? 'bg-green-600' : 'bg-brand-red',
                        )}
                    />
                    {open ? 'Open now' : 'Closed'}
                </span>
            </div>

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
