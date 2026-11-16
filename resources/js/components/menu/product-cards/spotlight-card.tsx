import { ProductPrice } from '@/components/menu/product-price';
import { VariantSelector } from '@/components/menu/variant-selector';
import { SmartImage } from '@/components/smart-image';
import {
    AddButton,
    CardTarget,
    ProductInitial,
    ProductMarks,
    ViewButton,
} from './parts';
import type { ProductCardViewProps } from './types';

/**
 * Spotlight design: the photograph leads, wide across the top of the card,
 * with the marks pinned over it and the name, description and price beneath.
 * Built for menus with strong food photography.
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
    fallbackCategory,
}: ProductCardViewProps) {
    const blurb = product.description ?? product.subtitle;

    return (
        <article
            dir={rtl ? 'rtl' : 'ltr'}
            className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-card text-card-foreground ring-1 ring-border transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgb(0_0_0/0.5)]"
        >
            <CardTarget title={product.title} onOpen={onOpen} />

            <div className="pointer-events-none relative">
                {image ? (
                    <SmartImage
                        src={image}
                        alt={product.title}
                        className="aspect-[4/3] w-full"
                        imgClassName="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        draggable={false}
                    />
                ) : (
                    <ProductInitial
                        title={product.title}
                        category={fallbackCategory}
                        className="aspect-[4/3] w-full [&>span:last-child]:text-6xl"
                    />
                )}

                <ProductMarks
                    product={product}
                    className="absolute start-3 top-3 rounded-full bg-black/45 px-2 py-1 backdrop-blur-md empty:hidden [&_svg.text-green-600]:text-green-400"
                />
            </div>

            <div className="pointer-events-none flex flex-1 flex-col p-4">
                <h2 className="font-display text-lg leading-snug font-bold">
                    {product.title}
                </h2>

                {blurb && (
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {blurb}
                    </p>
                )}

                {hasVariants && (
                    <div className="pointer-events-auto relative z-10 mt-3">
                        <VariantSelector
                            variants={variants}
                            selectedIndex={selectedIndex}
                            onSelect={onSelectVariant}
                        />
                    </div>
                )}

                <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                    <ProductPrice
                        basePrice={basePrice}
                        discountPrice={discountPrice}
                        size="lg"
                    />

                    <span className="pointer-events-auto">
                        {enableCart ? (
                            <AddButton title={product.title} onClick={onQuickAdd} />
                        ) : (
                            <ViewButton title={product.title} onClick={onOpen} />
                        )}
                    </span>
                </div>
            </div>
        </article>
    );
}
