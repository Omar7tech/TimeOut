import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';

/** Header cart trigger with a live item-count badge. */
export function CartButton() {
    const { count, setOpen } = useCart();

    return (
        <Button
            size="icon"
            onClick={() => setOpen(true)}
            className="relative size-11 rounded-full bg-brand-red text-white hover:bg-brand-red/90 sm:size-9"
            aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
        >
            <ShoppingCart className="size-5.5 sm:size-5" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full border-2 border-black bg-brand-yellow px-1 text-[11px] leading-none font-extrabold text-black">
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </Button>
    );
}
