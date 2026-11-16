import { formatTime, isShopOpen, useShop, weeklyHours } from '@/lib/shop';
import { cn } from '@/lib/utils';

/**
 * Weekly opening hours for the footer, shown only when the shop runs on the
 * automatic schedule. Consecutive days with the same hours are merged into
 * ranges, today's row is marked, and a live open/closed word heads the list.
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
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Hours · الدوام
                <span
                    className={cn(
                        'rounded-full px-2 py-0.5 tracking-normal normal-case',
                        open
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-brand-red/15 text-brand-red-ink',
                    )}
                >
                    {open ? 'Open now' : 'Closed'}
                </span>
            </h3>

            <ul className="flex flex-col">
                {rows.map((row) => (
                    <li
                        key={row.label}
                        className={cn(
                            'flex items-center justify-between gap-6 border-b border-border py-2 text-sm last:border-b-0',
                            row.isToday
                                ? 'font-semibold text-foreground'
                                : 'text-foreground/70',
                        )}
                    >
                        <span className="flex items-center gap-2">
                            {row.isToday && (
                                <span className="size-1.5 rounded-full bg-brand-red" />
                            )}
                            {row.label}
                        </span>
                        {row.isClosed ? (
                            <span className="text-brand-red-ink">Closed</span>
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
