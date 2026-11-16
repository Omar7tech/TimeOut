import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

/** Header cart trigger with a live item-count badge. */
export function CartButton() {
    const { count, setOpen } = useCart();

    return (
        <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
            className="relative inline-flex size-11 items-center justify-center rounded-full bg-brand-red text-brand-ink transition-[scale,background-color] duration-200 hover:bg-brand-red/90 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
            <ShoppingBag className="size-5" strokeWidth={2.2} />
            {count > 0 && (
                <span
                    key={count}
                    className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-brand-yellow px-1 text-[0.6875rem] leading-none font-bold text-black tabular-nums ring-2 ring-background"
                >
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </button>
    );
}
