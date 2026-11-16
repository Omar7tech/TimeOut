import { usePricing } from '@/hooks/use-pricing';
import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/types';

interface VariantSelectorProps {
    variants: ProductVariant[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    /** Roomier options with each size's price, for the detail sheet. */
    size?: 'sm' | 'lg';
}

/**
 * The sizes a product comes in, as a row of options. The chosen one is filled
 * in ink so it reads at a glance; in the detail sheet each option also carries
 * its own price, so the customer never has to tap to compare.
 */
export function VariantSelector({
    variants,
    selectedIndex,
    onSelect,
    size = 'sm',
}: VariantSelectorProps) {
    const pricing = usePricing();
    const large = size === 'lg';

    return (
        <div
            role="radiogroup"
            aria-label="Size · الحجم"
            className={cn(
                'flex w-full gap-1 rounded-full bg-muted p-1',
                large && 'gap-1.5 rounded-2xl p-1.5',
            )}
        >
            {variants.map((variant, index) => {
                const selected = index === selectedIndex;
                const price = variant.discount_price ?? variant.price;

                return (
                    <button
                        key={index}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={(event) => {
                            event.stopPropagation();
                            onSelect(index);
                        }}
                        className={cn(
                            'relative z-10 flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center rounded-full px-2 text-xs font-semibold transition-[background-color,color,scale] duration-200 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                            large && 'min-h-14 rounded-xl text-sm',
                            selected
                                ? 'bg-foreground text-background shadow-sm'
                                : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                        )}
                    >
                        <span dir="auto" className="max-w-full truncate">
                            {variant.name}
                        </span>
                        {large && (
                            <span
                                dir="ltr"
                                className={cn(
                                    'mt-0.5 text-[0.6875rem] font-medium tabular-nums',
                                    selected
                                        ? 'text-background/70'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {pricing.showUsd
                                    ? pricing.usd(price)
                                    : pricing.lbp(price)}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
