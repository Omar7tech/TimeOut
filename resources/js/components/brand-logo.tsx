import { usePage } from '@inertiajs/react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

const OPEN_LOGO = '/logos/timeout-logo.png';
const CLOSED_LOGO = '/logos/timeout-logo-closed.png';

type BrandLogoProps = Omit<ComponentPropsWithoutRef<'img'>, 'src'> & {
    /** Force a variant; defaults to the shop's current open/closed state. */
    isOpen?: boolean;
};

/**
 * The Time Out Snack logo. Picks the open or closed artwork based on the shared
 * `shop.isOpen` setting, so it stays in sync everywhere it's used. Pass any
 * standard `<img>` props (className, alt, etc.) to size or style it per usage.
 */
export function BrandLogo({ isOpen, alt = 'Time Out Snack', className, ...props }: BrandLogoProps) {
    const shopOpen = usePage().props.shop?.isOpen ?? true;
    const open = isOpen ?? shopOpen;

    return (
        <img
            src={open ? OPEN_LOGO : CLOSED_LOGO}
            alt={alt}
            className={cn('select-none', className)}
            draggable={false}
            {...props}
        />
    );
}
