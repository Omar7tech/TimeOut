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
 * The figure in the display face with its currency set small beside it, so a
 * long Lebanese amount reads as one number rather than a string of digits.
 */
function Amount({
    value,
    currency,
    large,
    className,
}: {
    value: string;
    currency: string;
    large: boolean;
    className?: string;
}) {
    return (
        <span className={cn('inline-flex items-baseline gap-1', className)}>
            <span
                className={cn(
                    'font-display font-extrabold tracking-tight tabular-nums',
                    large ? 'text-2xl' : 'text-[1.0625rem]',
                )}
            >
                {value}
            </span>
            <span
                className={cn(
                    'font-semibold opacity-70',
                    large ? 'text-xs' : 'text-[0.625rem]',
                )}
            >
                {currency}
            </span>
        </span>
    );
}

/** Splits "990,000 LBP" into its figure, or "$7.00" into "7.00". */
function lbpFigure(formatted: string): string {
    return formatted.replace(/\s*LBP$/, '');
}

function usdFigure(formatted: string): string {
    return formatted.replace(/^\$/, '');
}

/**
 * A product price for the active display mode. When both currencies show, the
 * Lebanese pound leads (it's what most customers pay in), with the dollar
 * amount quieter beneath it. A discount turns the leading figure orange and
 * strikes the old one beside it.
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
    const large = size === 'lg';

    // LBP leads whenever it's shown; USD leads only on a dollars-only menu.
    const lbpLeads = pricing.showLbp;
    const lead = (usd: number): { value: string; currency: string } =>
        lbpLeads
            ? { value: lbpFigure(pricing.lbp(usd)), currency: 'LBP' }
            : { value: usdFigure(pricing.usd(usd)), currency: 'USD' };

    const current = lead(effectivePrice);
    const before = lead(basePrice);

    return (
        <span
            dir="ltr"
            className={cn(
                'inline-flex flex-col items-start leading-none',
                className,
            )}
        >
            <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <Amount
                    value={current.value}
                    currency={current.currency}
                    large={large}
                    className={cn(hasDiscount && 'text-brand-red-ink')}
                />
                {hasDiscount && (
                    <span
                        className={cn(
                            'font-medium text-muted-foreground tabular-nums line-through decoration-brand-red-ink/70',
                            large ? 'text-sm' : 'text-[0.6875rem]',
                        )}
                    >
                        {before.value}
                    </span>
                )}
            </span>
            {lbpLeads && pricing.showUsd && (
                <span
                    className={cn(
                        'mt-1 font-medium text-muted-foreground tabular-nums',
                        large ? 'text-xs' : 'text-[0.6875rem]',
                    )}
                >
                    {pricing.usd(effectivePrice)}
                </span>
            )}
        </span>
    );
}
