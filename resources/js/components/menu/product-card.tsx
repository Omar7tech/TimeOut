import { Eye, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { ProductDialog } from '@/components/menu/product-dialog';
import { ProductPrice } from '@/components/menu/product-price';
import { VariantSelector } from '@/components/menu/variant-selector';
import { useCart } from '@/contexts/cart-context';
import type { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

/**
 * Compact menu item card: thumbnail, single-line title/subtitle/description,
 * price, and quick actions. The "View" action opens the full details modal.
 */
export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const variants = product.variants ?? [];
    const hasVariants = variants.length > 0;

    // Default to the last variant when variants exist.
    const [selectedIndex, setSelectedIndex] = useState(hasVariants ? variants.length - 1 : 0);
    const [open, setOpen] = useState(false);

    const selectedVariant = hasVariants ? variants[selectedIndex] : null;
    const basePrice = selectedVariant ? selectedVariant.price : product.price;
    const discountPrice = selectedVariant ? selectedVariant.discount_price : product.discount_price;
    const effectivePrice = discountPrice ?? basePrice;

    const image = product.thumb ?? product.image;

    const handleAddToCart = (): void => {
        addItem({
            productId: product.id,
            variantIndex: hasVariants ? selectedIndex : null,
            title: product.title,
            variantName: selectedVariant?.name ?? null,
            unitUsd: effectivePrice,
            image,
        });
        setOpen(false);
    };

    return (
        <div className="group flex min-w-0 flex-col rounded-lg border-2 border-neutral-700 bg-card p-2.5 text-card-foreground shadow-[4px_4px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000]">
            <div className="flex gap-3">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-md md:size-28">
                    {image ? (
                        <img
                            src={image}
                            alt={product.title}
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                            draggable={false}
                            loading="lazy"
                        />
                    ) : (
                        <div className="size-full bg-muted" />
                    )}

                    {product.available_today && (
                        <span className="absolute left-1 top-1 rounded border border-black bg-brand-yellow px-1 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-black">
                            Today
                        </span>
                    )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-1.5">
                        <h3 className="min-w-0 flex-1 truncate text-sm font-black leading-tight">{product.title}</h3>
                        {product.is_featured && (
                            <Star className="size-3.5 shrink-0 fill-brand-yellow text-brand-yellow" />
                        )}
                    </div>

                    {product.subtitle && (
                        <p className="truncate text-xs text-muted-foreground">{product.subtitle}</p>
                    )}

                    {product.description && (
                        <p className="truncate text-xs text-muted-foreground/80">{product.description}</p>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
                        <ProductPrice basePrice={basePrice} discountPrice={discountPrice} />

                        <div className="flex shrink-0 items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                aria-label="View details"
                                className="inline-flex size-8 items-center justify-center rounded-md border-2 border-black bg-card text-card-foreground shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <Eye className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                aria-label="Add to cart"
                                className="inline-flex size-8 items-center justify-center rounded-md border-2 border-black bg-brand-red text-white shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <ShoppingCart className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {hasVariants && (
                <div className="mt-2.5 border-t-2 border-dashed border-neutral-700 pt-2.5">
                    <VariantSelector variants={variants} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
                </div>
            )}

            <ProductDialog
                product={product}
                open={open}
                onOpenChange={setOpen}
                selectedIndex={selectedIndex}
                onSelectVariant={setSelectedIndex}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
}
