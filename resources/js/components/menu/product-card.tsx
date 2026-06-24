import { memo, useState } from 'react';
import type { ComponentType } from 'react';
import { ClassicCard } from '@/components/menu/product-cards/classic-card';
import { MinimalCard } from '@/components/menu/product-cards/minimal-card';
import { SpotlightCard } from '@/components/menu/product-cards/spotlight-card';
import type { ProductCardViewProps } from '@/components/menu/product-cards/types';
import { ProductDialog } from '@/components/menu/product-dialog';
import type { CartAddon } from '@/contexts/cart-context';
import { useCartActions } from '@/contexts/cart-context';
import { useProductCardDesign } from '@/hooks/use-product-card-design';
import { isArabic } from '@/lib/utils';
import type { CategoryAddon, Product, ProductCardDesign } from '@/types';

interface ProductCardProps {
    product: Product;
    /** Add-ons from the product's category; empty when none are configured. */
    addons?: CategoryAddon[];
    /** Whether add-to-cart actions are available (delivery menu only). */
    enableCart?: boolean;
}

/** The presentational card for each storefront-selectable design. */
const DESIGNS: Record<
    ProductCardDesign,
    ComponentType<ProductCardViewProps>
> = {
    classic: ClassicCard,
    spotlight: SpotlightCard,
    minimal: MinimalCard,
};

/**
 * Owns the shared card state (variant selection, pricing, cart actions, details
 * dialog) and renders the layout chosen in the storefront settings. The visual
 * variants live in `./product-cards`; this dispatcher keeps their behaviour
 * identical so switching designs never changes how a card works.
 */
function ProductCardComponent({
    product,
    addons = [],
    enableCart = false,
}: ProductCardProps) {
    const { addItem } = useCartActions();
    const design = useProductCardDesign();
    const variants = product.variants ?? [];
    const hasVariants = variants.length > 0;

    // Default to the last variant when variants exist.
    const [selectedIndex, setSelectedIndex] = useState(
        hasVariants ? variants.length - 1 : 0,
    );
    const [open, setOpen] = useState(false);

    const selectedVariant = hasVariants ? variants[selectedIndex] : null;
    const basePrice = selectedVariant ? selectedVariant.price : product.price;
    const discountPrice = selectedVariant
        ? selectedVariant.discount_price
        : product.discount_price;
    const effectivePrice = discountPrice ?? basePrice;

    const image = product.thumb ?? product.image;

    // Right-align and flip the text block to RTL when the title is Arabic.
    const rtl = isArabic(product.title);

    const addToCart = (selectedAddons: CartAddon[] = []): void => {
        addItem({
            productId: product.id,
            variantIndex: hasVariants ? selectedIndex : null,
            title: product.title,
            variantName: selectedVariant?.name ?? null,
            unitUsd: effectivePrice,
            image,
            addons: selectedAddons,
        });
        setOpen(false);
    };

    // Quick add: when extras are available, open the dialog so they can be
    // chosen instead of silently adding the item without them.
    const handleQuickAdd = (): void => {
        if (addons.length > 0) {
            setOpen(true);

            return;
        }

        addToCart();
    };

    const Card = DESIGNS[design];

    return (
        <>
            <Card
                product={product}
                enableCart={enableCart}
                image={image}
                rtl={rtl}
                variants={variants}
                hasVariants={hasVariants}
                selectedIndex={selectedIndex}
                onSelectVariant={setSelectedIndex}
                basePrice={basePrice}
                discountPrice={discountPrice}
                onOpen={() => setOpen(true)}
                onQuickAdd={handleQuickAdd}
            />

            <ProductDialog
                product={product}
                addons={addons}
                open={open}
                onOpenChange={setOpen}
                selectedIndex={selectedIndex}
                onSelectVariant={setSelectedIndex}
                onAddToCart={enableCart ? addToCart : undefined}
            />
        </>
    );
}

/**
 * Memoized so cart mutations elsewhere (which don't change this card's props)
 * don't re-render the whole product grid.
 */
export const ProductCard = memo(ProductCardComponent);
