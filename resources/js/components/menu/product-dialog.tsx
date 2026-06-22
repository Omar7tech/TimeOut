import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ProductPrice } from '@/components/menu/product-price';
import { VariantSelector } from '@/components/menu/variant-selector';
import { SmartImage } from '@/components/smart-image';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { CartAddon } from '@/contexts/cart-context';
import { usePricing } from '@/hooks/use-pricing';
import type { CategoryAddon, Product } from '@/types';

interface ProductDialogProps {
    product: Product;
    /** Add-ons from the product's category; empty when none are configured. */
    addons?: CategoryAddon[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedIndex: number;
    onSelectVariant: (index: number) => void;
    /** When omitted, the add-to-cart action is hidden (dine-in menu). */
    onAddToCart?: (addons: CartAddon[]) => void;
}

/**
 * Full product details in a responsive dialog (bottom sheet on mobile,
 * centered modal on desktop): image, full title/subtitle/description,
 * variant picker, optional add-on extras, price, and an add-to-cart action.
 */
export function ProductDialog({
    product,
    addons = [],
    open,
    onOpenChange,
    selectedIndex,
    onSelectVariant,
    onAddToCart,
}: ProductDialogProps) {
    const pricing = usePricing();
    const variants = product.variants ?? [];
    const hasVariants = variants.length > 0;
    const selectedVariant = hasVariants ? variants[selectedIndex] : null;
    const basePrice = selectedVariant ? selectedVariant.price : product.price;
    const discountPrice = selectedVariant
        ? selectedVariant.discount_price
        : product.discount_price;
    const image = product.image ?? product.thumb;

    // Quantity chosen per add-on, indexed alongside `addons`.
    const [addonQuantities, setAddonQuantities] = useState<number[]>([]);

    // Reset the extras whenever the dialog opens, so it starts clean each time.
    // Done during render (not in an effect) by tracking the previous open state.
    const [wasOpen, setWasOpen] = useState(open);

    if (open !== wasOpen) {
        setWasOpen(open);

        if (open) {
            setAddonQuantities(addons.map(() => 0));
        }
    }

    const selectedAddons = useMemo<CartAddon[]>(
        () =>
            addons
                .map((addon, index) => ({
                    name: addon.name,
                    price: Number(addon.price),
                    quantity: addonQuantities[index] ?? 0,
                }))
                .filter((addon) => addon.quantity > 0),
        [addons, addonQuantities],
    );

    const extrasUsd = selectedAddons.reduce(
        (total, addon) => total + addon.price * addon.quantity,
        0,
    );

    const setAddonQuantity = (index: number, next: number): void => {
        setAddonQuantities((previous) => {
            const updated = [...previous];
            updated[index] = Math.max(0, next);

            return updated;
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* The panel itself doesn't scroll: the image and footer stay fixed
                and only the description scrolls within its own bounds. */}
            <DialogContent className="gap-0 overflow-y-hidden p-0">
                {image ? (
                    <div className="shrink-0 px-5 pt-2">
                        <SmartImage
                            src={image}
                            alt={product.title}
                            className="aspect-video w-full rounded-xl border-2 border-black shadow-[3px_3px_0_0_#000]"
                            imgClassName="object-cover"
                            draggable={false}
                        >
                            {product.available_today && (
                                <span className="absolute top-2 left-2 rounded border border-black bg-brand-yellow px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-black uppercase">
                                    Today
                                </span>
                            )}
                        </SmartImage>
                    </div>
                ) : (
                    // Keep the close button clear of the title when there's no image.
                    <div className="h-2 shrink-0" />
                )}

                {/* Details column. Title, variants, extras and the footer stay
                    put; only the description scrolls within its own bounds. The
                    wrapper keeps a fallback scroll so nothing is ever clipped. */}
                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
                    <DialogHeader className="shrink-0">
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
                        <p className="max-h-[35vh] overflow-y-auto overscroll-contain pr-1 text-sm leading-relaxed text-muted-foreground">
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

                    {onAddToCart && addons.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <p className="flex items-center gap-2 text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
                                <span>Add extras</span>
                                <span dir="rtl">الإضافات</span>
                            </p>
                            <ul className="flex flex-col gap-2">
                                {addons.map((addon, index) => {
                                    const quantity =
                                        addonQuantities[index] ?? 0;
                                    const active = quantity > 0;

                                    return (
                                        <li
                                            key={index}
                                            className="flex items-center justify-between gap-3 rounded-lg border-2 border-neutral-700 bg-background px-3 py-2"
                                        >
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate font-bold">
                                                    {addon.name}
                                                </span>
                                                <span className="text-xs font-bold text-muted-foreground">
                                                    {pricing.showUsd
                                                        ? pricing.usd(
                                                              Number(
                                                                  addon.price,
                                                              ),
                                                          )
                                                        : pricing.lbp(
                                                              Number(
                                                                  addon.price,
                                                              ),
                                                          )}
                                                </span>
                                            </div>

                                            <div className="flex shrink-0 items-center overflow-hidden rounded-md border-2 border-black">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setAddonQuantity(
                                                            index,
                                                            quantity - 1,
                                                        )
                                                    }
                                                    disabled={!active}
                                                    aria-label={`Less ${addon.name}`}
                                                    className="flex size-7 items-center justify-center bg-card transition-colors hover:bg-muted disabled:opacity-40"
                                                >
                                                    <Minus className="size-3.5" />
                                                </button>
                                                <span className="w-7 text-center text-sm font-extrabold tabular-nums">
                                                    {quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setAddonQuantity(
                                                            index,
                                                            quantity + 1,
                                                        )
                                                    }
                                                    aria-label={`More ${addon.name}`}
                                                    className="flex size-7 items-center justify-center bg-card transition-colors hover:bg-muted"
                                                >
                                                    <Plus className="size-3.5" />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Fixed footer: price and add-to-cart stay visible no matter
                    how long the description scrolls. */}
                <div className="flex shrink-0 items-center justify-between gap-3 border-t-2 border-neutral-700 p-5">
                    <ProductPrice
                        basePrice={basePrice}
                        discountPrice={discountPrice}
                        size="lg"
                    />
                    {onAddToCart && (
                        <button
                            type="button"
                            onClick={() => onAddToCart(selectedAddons)}
                            className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-brand-red px-4 py-2 font-extrabold tracking-wide text-white uppercase shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                            <ShoppingCart className="size-4" />
                            Add to cart
                            {extrasUsd > 0 && pricing.showUsd && (
                                <span className="font-bold text-white/80">
                                    +{pricing.usd(extrasUsd)}
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
