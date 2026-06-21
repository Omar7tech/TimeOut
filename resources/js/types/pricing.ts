export type PriceDisplay = 'usd' | 'lbp' | 'both';

export type Pricing = {
    display: PriceDisplay;
    /** LBP per 1 USD, or null when LBP pricing is disabled. */
    lbpRate: number | null;
    /** Delivery charge in USD added to takeaway orders, or null when not charged. */
    deliveryFeeUsd: number | null;
};
