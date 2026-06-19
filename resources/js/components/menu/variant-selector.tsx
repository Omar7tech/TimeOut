import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/types';

interface VariantSelectorProps {
    variants: ProductVariant[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

/** Joined segmented control for picking a product variant. */
export function VariantSelector({ variants, selectedIndex, onSelect }: VariantSelectorProps) {
    return (
        <div
            role="group"
            aria-label="Choose a variant"
            className="flex w-full overflow-hidden rounded-md border-2 border-black shadow-[2px_2px_0_0_#000]"
        >
            {variants.map((variant, index) => {
                const selected = index === selectedIndex;

                return (
                    <button
                        key={index}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onSelect(index)}
                        className={cn(
                            'min-w-0 flex-1 truncate px-2 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors not-first:-ml-px not-first:border-l-2 not-first:border-black',
                            selected ? 'bg-brand-red text-white' : 'bg-card text-card-foreground hover:bg-muted',
                        )}
                    >
                        {variant.name}
                    </button>
                );
            })}
        </div>
    );
}
