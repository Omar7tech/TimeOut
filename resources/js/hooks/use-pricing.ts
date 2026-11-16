import { usePage } from '@inertiajs/react';
import { convertUsdToLbp, formatLbp, formatUsd } from '@/lib/currency';
import type { Pricing } from '@/types';

export type PriceParts = {
    /** Whether the USD price should be shown. */
    showUsd: boolean;
    /** Whether the LBP price should be shown. */
    showLbp: boolean;
    /** Delivery charge in USD added to takeaway orders, or null when not charged. */
    deliveryFeeUsd: number | null;
    usd: (usd: number) => string;
    lbp: (usd: number) => string;
    /** The amount in the leading currency: LBP whenever it's shown, else USD. */
    primary: (usd: number) => string;
};

/**
 * Reads the shared pricing settings and exposes helpers to format a USD amount
 * for the active display mode. Falls back to USD-only when LBP is unavailable.
 */
export function usePricing(): PriceParts {
    const { pricing } = usePage().props;
    const rate = pricing?.lbpRate ?? null;
    const display: Pricing['display'] =
        rate === null ? 'usd' : (pricing?.display ?? 'usd');

    const showLbp = (display === 'lbp' || display === 'both') && rate !== null;
    const lbp = (usd: number): string =>
        rate === null ? '' : formatLbp(convertUsdToLbp(usd, rate));

    return {
        showUsd: display === 'usd' || display === 'both',
        showLbp,
        deliveryFeeUsd: pricing?.deliveryFeeUsd ?? null,
        usd: (usd: number) => formatUsd(usd),
        lbp,
        primary: (usd: number) => (showLbp ? lbp(usd) : formatUsd(usd)),
    };
}
