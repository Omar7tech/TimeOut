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

/** The shared shop settings from the page props. */
export function useShop(): Shop {
    return usePage().props.shop;
}

/** The shop's current open/closed state, recomputed live in automatic mode. */
export function useShopOpen(): boolean {
    return isShopOpen(useShop());
}
