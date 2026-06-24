import type { Product, ProductVariant } from '@/types';

/**
 * The computed view-model shared by every product card design. The dispatcher
 * ({@link ../product-card}) owns the state, pricing and cart logic and hands
 * these down so each design only has to lay them out.
 */
export interface ProductCardViewProps {
    product: Product;
    /** Whether the add-to-cart action is available (delivery menu only). */
    enableCart: boolean;
    /** The resolved thumbnail/image URL, or null when the product has none. */
    image: string | null;
    /** True when the title is Arabic, so the text block flips to RTL. */
    rtl: boolean;
    variants: ProductVariant[];
    hasVariants: boolean;
    selectedIndex: number;
    onSelectVariant: (index: number) => void;
    basePrice: number;
    discountPrice: number | null;
    /** Opens the full product details dialog. */
    onOpen: () => void;
    /** Quick-adds to cart, or opens the dialog when add-ons must be chosen. */
    onQuickAdd: () => void;
}
