import { useShopOpen } from '@/lib/shop';
import { cn } from '@/lib/utils';

/**
 * Says the shop is closed, plainly, in both languages. While the shop is open
 * there is nothing to say, so it renders nothing.
 */
export function ShopStatus({ className }: { className?: string }) {
    const open = useShopOpen();

    if (open) {
        return null;
    }

    return (
        <span
            className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-red/15 px-3.5 text-xs font-semibold text-brand-red-ink',
                className,
            )}
        >
            Closed
            <span className="opacity-60">·</span>
            <span lang="ar">مغلق الآن</span>
        </span>
    );
}
