import { usePage } from '@inertiajs/react';
import type { CategoryCardDesign } from '@/types';

const DESIGNS: readonly string[] = ['slab', 'tile', 'list', 'bubbles'];

/**
 * Reads the section card design chosen in the dashboard from the menu page
 * props, falling back to the orange slab when it's missing or unrecognised.
 */
export function useCategoryCardDesign(): CategoryCardDesign {
    const design = usePage().props.categoryDesign;

    return typeof design === 'string' && DESIGNS.includes(design)
        ? (design as CategoryCardDesign)
        : 'slab';
}
