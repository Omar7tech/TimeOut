import { Clock, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ProductMarks } from '@/components/menu/product-cards/parts';
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
import { isArabic } from '@/lib/utils';
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

    const rtl = isArabic(product.title);
    const totalUsd = (discountPrice ?? basePrice) + extrasUsd;
    const money = (usd: number): string =>
        pricing.primary(usd);
    const hasPrepTime =
        product.preparation_time !== null && product.preparation_time > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* The sheet does not scroll as a whole: the photo heads it, the
                details scroll in the middle, and the order bar stays put. */}
            <DialogContent className="gap-0 overflow-hidden p-0 pb-0 sm:max-w-xl sm:pb-0 [&>span:first-child]:absolute [&>span:first-child]:inset-x-0 [&>span:first-child]:top-2 [&>span:first-child]:z-10 [&>span:first-child]:bg-white/70">
                {image ? (
                    <SmartImage
                        src={image}
                        alt={product.title}
                        className="aspect-[16/10] w-full shrink-0 sm:aspect-[16/9]"
                        imgClassName="object-cover"
                        draggable={false}
                        loading="eager"
                    />
                ) : (
                    // Keep the close button clear of the title when there is no photo.
                    <div className="h-14 shrink-0" />
                )}

                <div
                    dir={rtl ? 'rtl' : 'ltr'}
                    className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-5 pt-5 pb-6 md:px-6"
                >
                    <DialogHeader className="shrink-0 gap-2 text-start">
                        <ProductMarks product={product} />
                        <DialogTitle className="pe-10 text-[1.75rem]">
                            {product.title}
                        </DialogTitle>
                        {product.subtitle && (
                            <p className="text-sm font-medium text-muted-foreground">
                                {product.subtitle}
                            </p>
                        )}
                    </DialogHeader>

                    {(hasPrepTime || product.description) && (
                        <div className="flex flex-col gap-3">
                            {product.description && (
                                <p className="text-[0.9375rem] leading-relaxed text-foreground/85">
                                    {product.description}
                                </p>
                            )}
                            {hasPrepTime && (
                                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold">
                                    <Clock className="size-3.5 text-brand-red-ink" />
                                    <span dir="ltr">
                                        ~{product.preparation_time} min
                                    </span>
                                    <span className="text-muted-foreground">
                                        · وقت التحضير
                                    </span>
                                </span>
                            )}
                        </div>
                    )}

                    {hasVariants && (
                        <div className="flex flex-col gap-2.5">
                            <SheetLabel
                                english="Choose a size"
                                arabic="اختر الحجم"
                            />
                            <VariantSelector
                                variants={variants}
                                selectedIndex={selectedIndex}
                                onSelect={onSelectVariant}
                                size="lg"
                            />
                        </div>
                    )}

                    {onAddToCart && addons.length > 0 && (
                        <div className="flex flex-col gap-2.5">
                            <SheetLabel english="Add extras" arabic="الإضافات" />
                            <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl bg-muted/60">
                                {addons.map((addon, index) => {
                                    const quantity =
                                        addonQuantities[index] ?? 0;
                                    const active = quantity > 0;

                                    return (
                                        <li
                                            key={index}
                                            className="flex items-center justify-between gap-3 px-4 py-2.5"
                                        >
                                            <div className="flex min-w-0 flex-col">
                                                <span
                                                    dir="auto"
                                                    className="truncate text-sm font-semibold"
                                                >
                                                    {addon.name}
                                                </span>
                                                <span
                                                    dir="ltr"
                                                    className="text-start text-xs text-muted-foreground tabular-nums"
                                                >
                                                    +{money(Number(addon.price))}
                                                </span>
                                            </div>

                                            <div
                                                dir="ltr"
                                                className="flex shrink-0 items-center gap-1 rounded-full bg-background p-1 ring-1 ring-border"
                                            >
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
                                                    className="grid size-9 place-items-center rounded-full transition-[background-color,scale] hover:bg-muted active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
                                                >
                                                    <Minus className="size-4" />
                                                </button>
                                                <span className="w-5 text-center font-display text-sm font-bold tabular-nums">
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
                                                    className="grid size-9 place-items-center rounded-full bg-foreground text-background transition-[scale] hover:scale-105 active:scale-90"
                                                >
                                                    <Plus className="size-4" />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>

                {/* The order bar: price and add stay in reach however long the
                    details run. */}
                <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-card px-5 pt-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] md:px-6">
                    <ProductPrice
                        basePrice={basePrice}
                        discountPrice={discountPrice}
                        size="lg"
                    />
                    {onAddToCart && (
                        <button
                            type="button"
                            onClick={() => onAddToCart(selectedAddons)}
                            className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-brand-red ps-5 pe-1.5 text-[0.9375rem] font-semibold text-brand-ink transition-[scale,background-color] duration-200 hover:bg-brand-red/90 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
                        >
                            <ShoppingBag className="size-[1.125rem]" />
                            <span>Add · أضف</span>
                            <span
                                dir="ltr"
                                className="rounded-full bg-black/20 px-3 py-1.5 font-display text-sm font-bold tabular-nums"
                            >
                                {money(totalUsd)}
                            </span>
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

/** A small bilingual label over a group of choices in the sheet. */
function SheetLabel({ english, arabic }: { english: string; arabic: string }) {
    return (
        <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground">
            <span className="uppercase">{english}</span>
            <span aria-hidden className="h-px flex-1 bg-border" />
            <span lang="ar">{arabic}</span>
        </p>
    );
}
