import { ShoppingCart, Star } from 'lucide-react';
import { ProductPrice } from '@/components/menu/product-price';
import { VariantSelector } from '@/components/menu/variant-selector';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Product } from '@/types';

interface ProductDialogProps {
    product: Product;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedIndex: number;
    onSelectVariant: (index: number) => void;
    /** When omitted, the add-to-cart action is hidden (dine-in menu). */
    onAddToCart?: () => void;
}

/**
 * Full product details in a responsive dialog (bottom sheet on mobile,
 * centered modal on desktop): image, full title/subtitle/description,
 * variant picker and price, plus an add-to-cart action.
 */
export function ProductDialog({
    product,
    open,
    onOpenChange,
    selectedIndex,
    onSelectVariant,
    onAddToCart,
}: ProductDialogProps) {
    const variants = product.variants ?? [];
    const hasVariants = variants.length > 0;
    const selectedVariant = hasVariants ? variants[selectedIndex] : null;
    const basePrice = selectedVariant ? selectedVariant.price : product.price;
    const discountPrice = selectedVariant
        ? selectedVariant.discount_price
        : product.discount_price;
    const image = product.image ?? product.thumb;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {image ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-black shadow-[3px_3px_0_0_#000]">
                        <img
                            src={image}
                            alt={product.title}
                            className="size-full object-cover"
                            draggable={false}
                        />
                        {product.available_today && (
                            <span className="absolute top-2 left-2 rounded border border-black bg-brand-yellow px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-black uppercase">
                                Today
                            </span>
                        )}
                    </div>
                ) : (
                    // Keep the close button clear of the title when there's no image.
                    <div className="h-2" />
                )}

                <DialogHeader>
                    <DialogTitle className="flex items-start gap-2 pr-6">
                        <span className="flex-1">{product.title}</span>
                        {product.is_featured && (
                            <Star className="mt-1 size-5 shrink-0 fill-brand-yellow text-brand-yellow" />
                        )}
                    </DialogTitle>
                    {product.subtitle && (
                        <p className="text-sm font-semibold text-muted-foreground">
                            {product.subtitle}
                        </p>
                    )}
                </DialogHeader>

                {product.description && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
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

                <div className="mt-1 flex items-center justify-between gap-3">
                    <ProductPrice
                        basePrice={basePrice}
                        discountPrice={discountPrice}
                        size="lg"
                    />
                    {onAddToCart && (
                        <button
                            type="button"
                            onClick={onAddToCart}
                            className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-brand-red px-4 py-2 font-extrabold tracking-wide text-white uppercase shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                            <ShoppingCart className="size-4" />
                            Add to cart
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
