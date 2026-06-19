import { usePage } from '@inertiajs/react';
import { convertUsdToLbp, formatLbp, formatUsd } from '@/lib/currency';
import type { Pricing } from '@/types';

export type PriceParts = {
    /** Whether the USD price should be shown. */
    showUsd: boolean;
    /** Whether the LBP price should be shown. */
    showLbp: boolean;
    usd: (usd: number) => string;
    lbp: (usd: number) => string;
};

/**
 * Reads the shared pricing settings and exposes helpers to format a USD amount
 * for the active display mode. Falls back to USD-only when LBP is unavailable.
 */
export function usePricing(): PriceParts {
    const { pricing } = usePage().props;
    const rate = pricing?.lbpRate ?? null;
    const display: Pricing['display'] = rate === null ? 'usd' : (pricing?.display ?? 'usd');

    return {
        showUsd: display === 'usd' || display === 'both',
        showLbp: (display === 'lbp' || display === 'both') && rate !== null,
        usd: (usd: number) => formatUsd(usd),
        lbp: (usd: number) => (rate === null ? '' : formatLbp(convertUsdToLbp(usd, rate))),
    };
}
