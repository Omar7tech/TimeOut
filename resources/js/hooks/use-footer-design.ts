import { usePage } from '@inertiajs/react';
import type { FooterDesign } from '@/types';

/**
 * Reads the footer design chosen in the dashboard from the menu page props,
 * falling back to the classic footer when it's missing or unrecognised.
 */
export function useFooterDesign(): FooterDesign {
    const design = usePage().props.footerDesign;

    return design === 'receipt' ? 'receipt' : 'classic';
}
