import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { CartButton } from '@/components/menu/cart-button';
import { ShopStatus } from '@/components/menu/shop-status';
import { ThemeToggle } from '@/components/menu/theme-toggle';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
    /** Show the cart trigger (delivery menu only). */
    showCart?: boolean;
}

/**
 * The sticky top bar: the logo (home), the live open/closed light, the theme
 * switch and, on the delivery menu, the cart. It sits flush on the page and
 * only draws its frosted edge once the menu scrolls under it.
 */
export function SiteHeader({ showCart = false }: SiteHeaderProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const update = (): void => setScrolled(window.scrollY > 8);

        update();
        window.addEventListener('scroll', update, { passive: true });

        return () => window.removeEventListener('scroll', update);
    }, []);

    return (
        <header
            className={cn(
                'sticky top-0 z-30 transition-[background-color,box-shadow] duration-300',
                scrolled
                    ? 'bg-background/85 shadow-[0_1px_0_var(--border)] backdrop-blur-xl'
                    : 'bg-background',
            )}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:h-[4.5rem] md:px-6">
                <Link
                    href="/"
                    aria-label="Time Out Snack — home"
                    className="-m-1 shrink-0 rounded-lg p-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                    <BrandLogo alt="" className="h-9 md:h-11" />
                </Link>

                <div className="flex items-center gap-2">
                    <ShopStatus className="hidden min-[400px]:inline-flex" />
                    <ThemeToggle />
                    {showCart && <CartButton />}
                </div>
            </div>
        </header>
    );
}
