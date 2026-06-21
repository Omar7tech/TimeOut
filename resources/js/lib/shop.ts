import { usePage } from '@inertiajs/react';
import type { OpeningHours, Shop } from '@/types/shop';

/** Minutes since midnight for a `HH:mm` time string. */
function toMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);

    return hours * 60 + (minutes ?? 0);
}

/** Whether `now` falls inside a single day's opening hours (handles overnight). */
function isWithinHours(hours: OpeningHours, now: Date): boolean {
    if (hours.isClosed) {
        return false;
    }

    const current = now.getHours() * 60 + now.getMinutes();
    const opensAt = toMinutes(hours.opensAt);
    const closesAt = toMinutes(hours.closesAt);

    // A closing time at or before the opening time means the shop closes the
    // next day (e.g. open 18:00, close 02:00).
    if (closesAt <= opensAt) {
        return current >= opensAt || current < closesAt;
    }

    return current >= opensAt && current <= closesAt;
}

/**
 * Whether the shop is open, resolving its status mode. Mirrors the server-side
 * `GeneralSettings::isCurrentlyOpen()` so automatic mode can update live without
 * a page reload. Pass `now` to override the current time (useful for tests).
 */
export function isShopOpen(shop: Shop, now: Date = new Date()): boolean {
    if (shop.statusMode === 'manual') {
        return shop.isManuallyOpen;
    }

    const today = shop.openingHours.find((hours) => hours.day === now.getDay());

    return today ? isWithinHours(today, now) : false;
}

/** Days in display order (Monday first), with short labels indexed by `Date.getDay()`. */
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** A row in the weekly schedule, with consecutive same-hours days grouped together. */
export type HoursRow = {
    /** e.g. "Mon – Fri" or "Sat". */
    label: string;
    isClosed: boolean;
    opensAt: string;
    closesAt: string;
    /** Whether today falls within this grouped row. */
    isToday: boolean;
};

/** Format a `HH:mm` time as a friendly 12-hour string, e.g. "9:00 AM". */
export function formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours < 12 ? 'AM' : 'PM';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;

    return `${hour12}:${String(minutes ?? 0).padStart(2, '0')} ${period}`;
}

/**
 * The weekly opening hours, ordered Monday-first and with consecutive days that
 * share the same hours merged into a single range (e.g. "Mon – Fri"). The row
 * covering today is flagged so it can be highlighted.
 */
export function weeklyHours(shop: Shop, now: Date = new Date()): HoursRow[] {
    const byDay = new Map(shop.openingHours.map((hours) => [hours.day, hours]));
    const today = now.getDay();

    const groups: {
        startDay: number;
        endDay: number;
        hours: OpeningHours;
        isToday: boolean;
    }[] = [];

    for (const day of DISPLAY_ORDER) {
        const hours = byDay.get(day);

        if (!hours) {
            continue;
        }

        const last = groups.at(-1);
        const matchesLast =
            last !== undefined &&
            last.hours.isClosed === hours.isClosed &&
            (hours.isClosed ||
                (last.hours.opensAt === hours.opensAt &&
                    last.hours.closesAt === hours.closesAt));

        if (matchesLast) {
            last.endDay = day;
            last.isToday ||= day === today;
        } else {
            groups.push({
                startDay: day,
                endDay: day,
                hours,
                isToday: day === today,
            });
        }
    }

    return groups.map((group) => ({
        label:
            group.startDay === group.endDay
                ? SHORT_DAYS[group.startDay]
                : `${SHORT_DAYS[group.startDay]} – ${SHORT_DAYS[group.endDay]}`,
        isClosed: group.hours.isClosed,
        opensAt: group.hours.opensAt,
        closesAt: group.hours.closesAt,
        isToday: group.isToday,
    }));
}

/** The shared shop settings from the page props. */
export function useShop(): Shop {
    return usePage().props.shop;
}

/** The shop's current open/closed state, recomputed live in automatic mode. */
export function useShopOpen(): boolean {
    return isShopOpen(useShop());
}
