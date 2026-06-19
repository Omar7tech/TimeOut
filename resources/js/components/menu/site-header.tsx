import { CartButton } from '@/components/menu/cart-button';
import { ThemeToggle } from '@/components/menu/theme-toggle';

interface SiteHeaderProps {
    /** Show the cart trigger (delivery menu only). */
    showCart?: boolean;
}

/**
 * Shared top bar for the customer-facing pages: logo on the left, theme toggle
 * and cart on the right (cart on the delivery menu only).
 */
export function SiteHeader({ showCart = false }: SiteHeaderProps) {
    return (
        <header className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 md:px-10">
            <img
                src="/logos/timeout-logo.png"
                alt="Time Out Snack"
                className="h-12 select-none md:h-16"
                draggable={false}
            />

            <div className="flex items-center gap-2">
                <ThemeToggle />
                {showCart && <CartButton />}
            </div>
        </header>
    );
}
