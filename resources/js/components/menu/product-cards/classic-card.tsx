import { Eye, ShoppingCart, Star } from 'lucide-react';
import { DietIcons } from '@/components/menu/diet-icons';
import { ProductPrice } from '@/components/menu/product-price';
import { VariantSelector } from '@/components/menu/variant-selector';
import { SmartImage } from '@/components/smart-image';
import { cn } from '@/lib/utils';
import type { ProductCardViewProps } from './types';

/**
 * Classic design: a compact neo-brutalist card with the thumbnail on the left
 * and a single-line title/subtitle/description plus price and quick actions on
 * the right. This is the storefront's default layout.
 */
export function ClassicCard({
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
        <div className="group flex h-full min-w-0 flex-col rounded-lg border-2 border-neutral-700 bg-card p-2.5 text-card-foreground shadow-[4px_4px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000]">
            <div className="flex gap-3">
                {image && (
                    <button
                        type="button"
                        onClick={onOpen}
                        aria-label="View details"
                        className="shrink-0 cursor-pointer rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                        <SmartImage
                            src={image}
                            alt={product.title}
                            className="size-20 rounded-md md:size-28"
                            imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
                            draggable={false}
                        >
                            {product.available_today && (
                                <span className="absolute top-1 left-1 rounded border border-black bg-brand-yellow px-1 py-0.5 text-[9px] font-extrabold tracking-wide text-black uppercase">
                                    Today
                                </span>
                            )}
                        </SmartImage>
                    </button>
                )}

                <div className="flex min-w-0 flex-1 flex-col">
                    <div
                        className={cn(
                            'flex items-center gap-1.5',
                            rtl && 'flex-row-reverse',
                        )}
                    >
                        <h3
                            dir={rtl ? 'rtl' : undefined}
                            className={cn(
                                'min-w-0 flex-1 truncate text-sm leading-tight font-black',
                                rtl && 'text-right',
                            )}
                        >
                            {product.title}
                        </h3>
                        {!image && product.available_today && (
                            <span className="shrink-0 rounded border border-black bg-brand-yellow px-1 py-0.5 text-[9px] font-extrabold tracking-wide text-black uppercase">
                                Today
                            </span>
                        )}
                        {product.is_featured && (
                            <Star className="size-3.5 shrink-0 fill-brand-yellow text-brand-yellow" />
                        )}
                        <DietIcons product={product} />
                    </div>

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

                    {product.description && (
                        <p
                            dir={rtl ? 'rtl' : undefined}
                            className={cn(
                                'truncate text-xs text-muted-foreground/80',
                                rtl && 'text-right',
                            )}
                        >
                            {product.description}
                        </p>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
                        <ProductPrice
                            basePrice={basePrice}
                            discountPrice={discountPrice}
                        />

                        <div className="flex shrink-0 items-center gap-1.5">
                            <button
                                type="button"
                                onClick={onOpen}
                                aria-label="View details"
                                className="inline-flex size-8 items-center justify-center rounded-md border-2 border-black bg-card text-card-foreground shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                            >
                                <Eye className="size-4" />
                            </button>
                            {enableCart && (
                                <button
                                    type="button"
                                    onClick={onQuickAdd}
                                    aria-label="Add to cart"
                                    className="inline-flex size-8 items-center justify-center rounded-md border-2 border-black bg-brand-red text-white shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                >
                                    <ShoppingCart className="size-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {hasVariants && (
                <div className="mt-2.5 border-t-2 border-dashed border-neutral-700 pt-2.5">
                    <VariantSelector
                        variants={variants}
                        selectedIndex={selectedIndex}
                        onSelect={onSelectVariant}
                    />
                </div>
            )}
        </div>
    );
}
