import { usePage } from '@inertiajs/react';
import type { MenuFilterDesign } from '@/types';

const DESIGNS: readonly string[] = ['pills', 'chips', 'dropdown'];

/**
 * Reads the storefront's chosen menu filter design from the menu page props,
 * falling back to the pills layout when it's missing or unrecognised.
 */
export function useMenuFilterDesign(): MenuFilterDesign {
    const design = usePage().props.filterDesign;

    return typeof design === 'string' && DESIGNS.includes(design)
        ? (design as MenuFilterDesign)
        : 'pills';
}
