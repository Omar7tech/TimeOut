import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/types';

interface VariantSelectorProps {
    variants: ProductVariant[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

/** Joined segmented control for picking a product variant, with a clear hint. */
export function VariantSelector({ variants, selectedIndex, onSelect }: VariantSelectorProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Layers className="size-3" />
                Choose an option
            </span>

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
                                selected ? 'bg-brand-yellow text-black' : 'bg-card text-card-foreground hover:bg-muted',
                            )}
                        >
                            {variant.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
