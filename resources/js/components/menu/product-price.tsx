import { usePricing } from '@/hooks/use-pricing';
import { cn } from '@/lib/utils';

interface ProductPriceProps {
    basePrice: number;
    discountPrice: number | null;
    /** Larger type for the detail sheet. */
    size?: 'sm' | 'lg';
    className?: string;
}

/**
 * A product price for the active display mode (USD, LBP, or both). The figure
 * is set in the display face like a price on a printed menu; a discount turns
 * it red with the old price struck beside it. In "both" mode the LBP amount
 * sits under the USD one, smaller and quieter.
 */
export function ProductPrice({
    basePrice,
    discountPrice,
    size = 'sm',
    className,
}: ProductPriceProps) {
    const pricing = usePricing();
    const hasDiscount = discountPrice !== null;
    const effectivePrice = hasDiscount ? discountPrice : basePrice;
    const both = pricing.showUsd && pricing.showLbp;
    const primary = (usd: number): string =>
        pricing.showUsd ? pricing.usd(usd) : pricing.lbp(usd);

    return (
        <span
            dir="ltr"
            className={cn('inline-flex flex-col items-start leading-none', className)}
        >
            <span className="flex items-baseline gap-1.5">
                <span
                    className={cn(
                        'font-display font-extrabold tracking-tight tabular-nums',
                        size === 'lg' ? 'text-2xl' : 'text-[1.0625rem]',
                        hasDiscount && 'text-brand-red-ink',
                    )}
                >
                    {primary(effectivePrice)}
                </span>
                {hasDiscount && (
                    <span
                        className={cn(
                            'font-medium text-muted-foreground tabular-nums line-through decoration-brand-red-ink/70',
                            size === 'lg' ? 'text-sm' : 'text-xs',
                        )}
                    >
                        {primary(basePrice)}
                    </span>
                )}
            </span>
            {both && (
                <span
                    className={cn(
                        'mt-1 font-medium text-muted-foreground tabular-nums',
                        size === 'lg' ? 'text-xs' : 'text-[0.6875rem]',
                    )}
                >
                    {pricing.lbp(effectivePrice)}
                </span>
            )}
        </span>
    );
}
