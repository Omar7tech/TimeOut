import { BrandLogo } from '@/components/brand-logo';
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
        <header className="header-zigzag mb-3">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 pb-6 pt-4 md:px-10">
                <BrandLogo className="h-12 md:h-16" />

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {showCart && <CartButton />}
                </div>
            </div>
        </header>
    );
}
