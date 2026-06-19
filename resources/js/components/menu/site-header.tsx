import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

/**
 * Shared top bar for the customer-facing pages: logo on the left, cart on the right.
 */
export function SiteHeader() {
    return (
        <header className="mx-auto flex max-w-[1400px] items-center justify-between px-4 md:px-10 py-4">
            <img
                src="/logos/timeout-logo.png"
                alt="Time Out Snack"
                className="h-10 select-none md:h-16"
                draggable={false}
            />

            <Button
                size="icon"
                className="relative rounded-full bg-brand-red text-white hover:bg-brand-red/90"
                aria-label="Cart"
            >
                <ShoppingCart className="size-5" />
            </Button>
        </header>
    );
}
