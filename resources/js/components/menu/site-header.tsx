import { CartButton } from '@/components/menu/cart-button';

/**
 * Shared top bar for the customer-facing pages: logo on the left, cart on the right.
 */
export function SiteHeader() {
    return (
        <header className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 md:px-10">
            <img
                src="/logos/timeout-logo.png"
                alt="Time Out Snack"
                className="h-10 select-none md:h-16"
                draggable={false}
            />

            <CartButton />
        </header>
    );
}
