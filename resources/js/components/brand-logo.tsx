import type { ComponentPropsWithoutRef } from 'react';
import { useShopOpen } from '@/lib/shop';
import { cn } from '@/lib/utils';

const OPEN_LOGO = '/logos/timeout-logo.png';
const CLOSED_LOGO = '/logos/timeout-logo-closed.png';
const LIGHT_LOGO = '/logos/timeout-logo-on-light.png';

type BrandLogoProps = Omit<ComponentPropsWithoutRef<'img'>, 'src'> & {
    /** Force a variant; defaults to the shop's current open/closed state. */
    isOpen?: boolean;
};

/**
 * The Time Out Snack logo. On the dark theme it picks the open or closed
 * artwork from the shared `shop.isOpen` setting; on the light theme it uses the
 * ink version, since the white script would vanish on paper (the closed state
 * is then carried by the status pill beside it). Both images are rendered and
 * swapped by the theme class, so there is no flash when the theme changes.
 */
export function BrandLogo({
    isOpen,
    alt = 'Time Out Snack',
    className,
    ...props
}: BrandLogoProps) {
    const shopOpen = useShopOpen();
    const open = isOpen ?? shopOpen;

    return (
        <>
            <img
                src={open ? OPEN_LOGO : CLOSED_LOGO}
                alt={alt}
                className={cn('hidden w-auto select-none dark:block', className)}
                draggable={false}
                {...props}
            />
            <img
                src={LIGHT_LOGO}
                alt={alt}
                className={cn('block w-auto select-none dark:hidden', className)}
                draggable={false}
                {...props}
            />
        </>
    );
}
