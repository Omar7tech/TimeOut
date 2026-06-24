import { usePage } from '@inertiajs/react';
import type { ProductCardDesign } from '@/types';

const DESIGNS: readonly string[] = ['classic', 'spotlight', 'minimal'];

/**
 * Reads the storefront's chosen product card design from the menu page props,
 * falling back to the classic layout when it's missing or unrecognised.
 */
export function useProductCardDesign(): ProductCardDesign {
    const design = usePage().props.cardDesign;

    return typeof design === 'string' && DESIGNS.includes(design)
        ? (design as ProductCardDesign)
        : 'classic';
}
