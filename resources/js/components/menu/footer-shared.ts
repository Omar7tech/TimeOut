import type { Category } from '@/types';

/** The shop on Google Maps, the same link as the structured data. */
export const MAPS_URL = 'https://maps.app.goo.gl/oqgUfzQC5yu9EVso6';

/** What every footer design is given by the menu page. */
export interface SiteFooterProps {
    categories: Category[];
    /** Jump to a section of the menu above (same client-side filter as the pills). */
    onSelectCategory?: (id: number) => void;
}
