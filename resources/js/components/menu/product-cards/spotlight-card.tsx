import { Eye, ShoppingCart, Star } from 'lucide-react';
import { DietIcons } from '@/components/menu/diet-icons';
import { ProductPrice } from '@/components/menu/product-price';
import { VariantSelector } from '@/components/menu/variant-selector';
import { SmartImage } from '@/components/smart-image';
import { cn } from '@/lib/utils';
import type { ProductCardViewProps } from './types';

/**
 * Spotlight design: a bold, image-forward poster card. A large image fills the
 * top with the title laid over a dark gradient, badges float in the corners,
 * and the price plus a prominent add-to-cart action anchor the body. Built to
 * make food photography the hero.
 */
export function SpotlightCard({
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
        <div className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-black bg-card text-card-foreground shadow-[5px_5px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]">
            <button
                type="button"
                onClick={onOpen}
                aria-label="View details"
                className="relative block w-full cursor-pointer overflow-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
                {image ? (
                    <SmartImage
                        src={image}
                        alt={product.title}
                        className="aspect-[4/3] w-full"
                        imgClassName="object-cover transition-transform duration-500 group-hover:scale-110"
                        draggable={false}
                    />
                ) : (
                    <div className="aspect-[4/3] w-full bg-muted" />
                )}

                {/* Dark gradient so the overlaid title stays legible over any image. */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                {/* Top-left: availability. */}
                {product.available_today && (
                    <span className="absolute top-2.5 left-2.5 rounded border-2 border-black bg-brand-yellow px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-black uppercase shadow-[2px_2px_0_0_#000]">
                        Today
                    </span>
                )}

                {/* Top-right: featured + diet markers in a frosted pill. */}
                {(product.is_featured ||
                    product.is_spicy ||
                    product.is_vegan) && (
                    <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full border-2 border-black bg-white/90 px-1.5 py-1 shadow-[2px_2px_0_0_#000] backdrop-blur">
                        {product.is_featured && (
                            <Star className="size-3.5 fill-brand-yellow text-brand-yellow" />
                        )}
                        <DietIcons product={product} iconClassName="size-3.5" />
                    </span>
                )}

                {/* Title + subtitle overlaid on the image. */}
                <span
                    dir={rtl ? 'rtl' : undefined}
                    className={cn(
                        'absolute inset-x-3 bottom-2.5 flex flex-col gap-0.5',
                        rtl ? 'items-end text-right' : 'items-start text-left',
                    )}
                >
                    <span className="line-clamp-2 text-lg leading-tight font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                        {product.title}
                    </span>
                    {product.subtitle && (
                        <span className="line-clamp-1 text-xs font-semibold text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                            {product.subtitle}
                        </span>
                    )}
                </span>
            </button>

            <div className="flex flex-1 flex-col gap-2.5 p-3">
                {product.description && (
                    <p
                        dir={rtl ? 'rtl' : undefined}
                        className={cn(
                            'line-clamp-2 text-xs text-muted-foreground',
                            rtl && 'text-right',
                        )}
                    >
                        {product.description}
                    </p>
                )}

                {hasVariants && (
                    <VariantSelector
                        variants={variants}
                        selectedIndex={selectedIndex}
                        onSelect={onSelectVariant}
                    />
                )}

                <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                    <ProductPrice
                        basePrice={basePrice}
                        discountPrice={discountPrice}
                    />

                    {enableCart ? (
                        <button
                            type="button"
                            onClick={onQuickAdd}
                            aria-label="Add to cart"
                            className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-brand-red px-3 py-1.5 text-xs font-extrabold tracking-wide text-white uppercase shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                            <ShoppingCart className="size-4" />
                            Add
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onOpen}
                            aria-label="View details"
                            className="inline-flex size-9 items-center justify-center rounded-md border-2 border-black bg-card text-card-foreground shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                            <Eye className="size-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
