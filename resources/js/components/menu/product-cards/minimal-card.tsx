import { Eye, ShoppingCart, Star } from 'lucide-react';
import { DietIcons } from '@/components/menu/diet-icons';
import { ProductPrice } from '@/components/menu/product-price';
import { VariantSelector } from '@/components/menu/variant-selector';
import { SmartImage } from '@/components/smart-image';
import { cn } from '@/lib/utils';
import type { ProductCardViewProps } from './types';

/**
 * Minimal design: a flat, airy card with soft borders, rounded type and ghost
 * controls instead of the hard-edged brutalist look. A large rounded thumbnail
 * sits beside calm, generously spaced typography for a clean, modern feel.
 */
export function MinimalCard({
    product,
    enableCart,
    image,
    rtl,
    variants,
    hasVariants,
    selectedIndex,
    onSelectVariant,
    basePrice,
    discountPrice,
    onOpen,
    onQuickAdd,
}: ProductCardViewProps) {
    return (
        <div className="group flex h-full gap-4 rounded-2xl border border-border bg-card p-3 text-card-foreground transition-all duration-200 hover:border-foreground/20 hover:bg-muted/40 hover:shadow-sm">
            {image && (
                <button
                    type="button"
                    onClick={onOpen}
                    aria-label="View details"
                    className="shrink-0 cursor-pointer self-center rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                    <SmartImage
                        src={image}
                        alt={product.title}
                        className="size-24 rounded-xl md:size-28"
                        imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
                        draggable={false}
                    >
                        {product.available_today && (
                            <span className="absolute top-1.5 left-1.5 rounded-full bg-brand-yellow px-2 py-0.5 text-[9px] font-bold tracking-wide text-black uppercase">
                                Today
                            </span>
                        )}
                    </SmartImage>
                </button>
            )}

            <div className="flex min-w-0 flex-1 flex-col">
                <div
                    className={cn(
                        'flex items-start gap-1.5',
                        rtl && 'flex-row-reverse',
                    )}
                >
                    <div className="min-w-0 flex-1">
                        <h3
                            dir={rtl ? 'rtl' : undefined}
                            className={cn(
                                'truncate text-sm leading-tight font-semibold tracking-tight',
                                rtl && 'text-right',
                            )}
                        >
                            {product.title}
                        </h3>
                        {product.subtitle && (
                            <p
                                dir={rtl ? 'rtl' : undefined}
                                className={cn(
                                    'truncate text-xs text-muted-foreground',
                                    rtl && 'text-right',
                                )}
                            >
                                {product.subtitle}
                            </p>
                        )}
                    </div>
                    {product.is_featured && (
                        <Star className="size-3.5 shrink-0 fill-brand-yellow text-brand-yellow" />
                    )}
                    <DietIcons product={product} />
                </div>

                {product.description && (
                    <p
                        dir={rtl ? 'rtl' : undefined}
                        className={cn(
                            'mt-1 line-clamp-2 text-xs text-muted-foreground/80',
                            rtl && 'text-right',
                        )}
                    >
                        {product.description}
                    </p>
                )}

                {hasVariants && (
                    <div className="mt-2">
                        <VariantSelector
                            variants={variants}
                            selectedIndex={selectedIndex}
                            onSelect={onSelectVariant}
                        />
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
                    <ProductPrice
                        basePrice={basePrice}
                        discountPrice={discountPrice}
                    />

                    <div className="flex shrink-0 items-center gap-1.5">
                        <button
                            type="button"
                            onClick={onOpen}
                            aria-label="View details"
                            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                            <Eye className="size-4" />
                        </button>
                        {enableCart && (
                            <button
                                type="button"
                                onClick={onQuickAdd}
                                aria-label="Add to cart"
                                className="inline-flex size-9 items-center justify-center rounded-full bg-brand-red text-white transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                            >
                                <ShoppingCart className="size-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
