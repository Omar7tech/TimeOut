import { usePricing } from '@/hooks/use-pricing';
import { cn } from '@/lib/utils';

interface ProductPriceProps {
    basePrice: number;
    discountPrice: number | null;
    /** Larger type for the detail modal. */
    size?: 'sm' | 'lg';
    className?: string;
}

/**
 * Renders a product price for the active display mode (USD, LBP, or both).
 * In "both" mode the two currencies are grouped in one badge, with the
 * pre-discount price struck through on the USD row only.
 */
export function ProductPrice({ basePrice, discountPrice, size = 'sm', className }: ProductPriceProps) {
    const pricing = usePricing();
    const hasDiscount = discountPrice !== null;
    const effectivePrice = hasDiscount ? discountPrice : basePrice;
    const both = pricing.showUsd && pricing.showLbp;

    if (both) {
        return (
            <span
                className={cn(
                    'inline-flex flex-col items-start gap-0.5 rounded-md border-2 border-black bg-brand-red px-2 py-1 font-extrabold leading-none text-white',
                    size === 'lg' && 'text-lg',
                    className,
                )}
            >
                <span className="flex items-baseline gap-1.5">
                    {pricing.usd(effectivePrice)}
                    {hasDiscount && (
                        <span className="text-[11px] font-bold text-white/55 line-through">{pricing.usd(basePrice)}</span>
                    )}
                </span>
                <span className={cn('font-bold text-white/90', size === 'lg' ? 'text-xs' : 'text-[11px]')}>
                    {pricing.lbp(effectivePrice)}
                </span>
            </span>
        );
    }

    return (
        <span className={cn('inline-flex flex-wrap items-center gap-x-2 gap-y-1', className)}>
            {hasDiscount && (
                <span className={cn('text-muted-foreground line-through', size === 'lg' ? 'text-base' : 'text-sm')}>
                    {pricing.showUsd ? pricing.usd(basePrice) : pricing.lbp(basePrice)}
                </span>
            )}
            <span
                className={cn(
                    'rounded-md border-2 border-black bg-brand-red px-2 py-0.5 font-extrabold text-white',
                    size === 'lg' && 'text-lg',
                )}
            >
                {pricing.showUsd ? pricing.usd(effectivePrice) : pricing.lbp(effectivePrice)}
            </span>
        </span>
    );
}
