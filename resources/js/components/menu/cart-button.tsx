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
            className="relative rounded-full bg-brand-red text-white hover:bg-brand-red/90"
            aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
        >
            <ShoppingCart className="size-5" />
            {count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full border-2 border-black bg-brand-yellow px-1 text-[11px] font-extrabold leading-none text-black">
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </Button>
    );
}
