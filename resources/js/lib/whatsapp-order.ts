import { cartItemUnitUsd } from '@/contexts/cart-context';
import type { CartItem } from '@/contexts/cart-context';
import type { LocationResult } from '@/lib/geolocation';
import type { PriceParts } from '@/hooks/use-pricing';

type OrderSummary = {
    items: CartItem[];
    pricing: PriceParts;
    subtotalUsd: number;
    /** Delivery charge in USD, or null when none applies. */
    deliveryFeeUsd: number | null;
    totalUsd: number;
    /** The customer's name, included when full name is required. */
    customerName?: string | null;
    /** The customer's coordinates, included when location sharing is on. */
    location?: LocationResult | null;
};

/**
 * Format a USD amount in every currency the storefront is set to display, so the
 * order message matches exactly what the customer sees on screen (e.g. "$6.00" or
 * "$6.00 / 540,000 LBP").
 */
function money(pricing: PriceParts, usd: number): string {
    const parts: string[] = [];

    if (pricing.showUsd) {
        parts.push(pricing.usd(usd));
    }

    if (pricing.showLbp) {
        parts.push(pricing.lbp(usd));
    }

    // Always fall back to USD so a line never renders empty.
    return parts.length > 0 ? parts.join(' / ') : pricing.usd(usd);
}

/**
 * Build the human-readable WhatsApp order message. Uses WhatsApp's `*bold*`
 * markup and a numbered list so the shop can read the order at a glance, with a
 * clear subtotal/delivery/total breakdown at the end.
 */
export function buildOrderMessage({
    items,
    pricing,
    subtotalUsd,
    deliveryFeeUsd,
    totalUsd,
    customerName,
    location,
}: OrderSummary): string {
    const divider = '———————————————';
    const lines: string[] = ['🛒 *New Order — Time Out Snack*', ''];

    if (customerName && customerName.trim() !== '') {
        lines.push(`👤 *Name:* ${customerName.trim()}`);
    }

    if (location) {
        const accuracy = Math.round(location.accuracy);
        // Flag coarse fixes so the shop knows the pin may be approximate.
        const precision =
            accuracy > 100 ? ` (approx. ±${accuracy}m)` : ` (±${accuracy}m)`;

        lines.push(
            `📍 *Location:* https://maps.google.com/?q=${location.latitude},${location.longitude}${precision}`,
        );
    }

    if (
        (customerName && customerName.trim() !== '') ||
        location
    ) {
        lines.push('');
    }

    items.forEach((item, index) => {
        const lineTotalUsd = cartItemUnitUsd(item) * item.quantity;

        const title = item.variantName
            ? `${item.title} — ${item.variantName}`
            : item.title;

        lines.push(`*${index + 1}. ${title}*`);
        lines.push(
            `   ${item.quantity} × ${money(pricing, item.unitUsd)} = ${money(pricing, item.unitUsd * item.quantity)}`,
        );

        item.addons.forEach((addon) => {
            const addonTotalUsd =
                addon.price * addon.quantity * item.quantity;

            lines.push(
                `   ➕ ${addon.quantity * item.quantity}× ${addon.name} (+${money(pricing, addonTotalUsd)})`,
            );
        });

        if (item.addons.length > 0) {
            lines.push(`   = ${money(pricing, lineTotalUsd)}`);
        }

        lines.push('');
    });

    lines.push(divider);

    if (deliveryFeeUsd !== null) {
        lines.push(`Subtotal: ${money(pricing, subtotalUsd)}`);
        lines.push(`Delivery: ${money(pricing, deliveryFeeUsd)}`);
    }

    lines.push(`*TOTAL: ${money(pricing, totalUsd)}*`);

    return lines.join('\n');
}

/**
 * Build the `https://wa.me` link that opens WhatsApp pre-filled with the order.
 * The number is reduced to digits as required by the wa.me format.
 */
export function buildWhatsAppUrl(number: string, message: string): string {
    const digits = number.replace(/\D/g, '');

    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
