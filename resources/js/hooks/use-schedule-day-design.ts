import { usePage } from '@inertiajs/react';
import type { ScheduleDayDesign } from '@/types';

const DESIGNS: readonly string[] = ['calendar', 'cards', 'chips'];

/**
 * Reads the weekly schedule's chosen day-picker design from the menu page
 * props, falling back to the calendar strip when it's missing or unrecognised.
 */
export function useScheduleDayDesign(): ScheduleDayDesign {
    const design = usePage().props.scheduleDesign;

    return typeof design === 'string' && DESIGNS.includes(design)
        ? (design as ScheduleDayDesign)
        : 'calendar';
}
