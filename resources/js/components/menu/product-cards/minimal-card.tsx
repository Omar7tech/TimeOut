import { ProductPrice } from '@/components/menu/product-price';
import { VariantSelector } from '@/components/menu/variant-selector';
import { SmartImage } from '@/components/smart-image';
import { AddButton, CardTarget, ProductMarks } from './parts';
import type { ProductCardViewProps } from './types';

/**
 * Minimal design: the printed-menu look. No card, just the dish name, a dotted
 * leader running to the price, and a line of description under it, ruled off
 * from the next dish. A small round photo sits at the start when there is one.
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
    const blurb = product.description ?? product.subtitle;

    return (
        <article
            dir={rtl ? 'rtl' : 'ltr'}
            className="group relative flex h-full gap-3.5 rounded-xl border-b border-border px-1 py-4 transition-colors duration-200 hover:bg-foreground/[0.03]"
        >
            <CardTarget title={product.title} onOpen={onOpen} />

            {image && (
                <SmartImage
                    src={image}
                    alt={product.title}
                    className="pointer-events-none size-16 shrink-0 rounded-full md:size-[4.5rem]"
                    imgClassName="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    draggable={false}
                />
            )}

            <div className="pointer-events-none flex min-w-0 flex-1 flex-col">
                <div className="flex items-baseline gap-2">
                    <h2 className="min-w-0 shrink truncate font-display text-base font-bold md:text-lg">
                        {product.title}
                    </h2>
                    <span aria-hidden className="leader h-2 min-w-6 flex-1" />
                    <ProductPrice
                        basePrice={basePrice}
                        discountPrice={discountPrice}
                        className="shrink-0 items-end"
                    />
                </div>

                <div className="mt-1 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1.5">
                        {blurb && (
                            <p className="line-clamp-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                                {blurb}
                            </p>
                        )}
                        <ProductMarks product={product} />
                    </div>

                    {enableCart && (
                        <span className="pointer-events-auto">
                            <AddButton
                                title={product.title}
                                onClick={onQuickAdd}
                                className="size-10"
                            />
                        </span>
                    )}
                </div>

                {hasVariants && (
                    <div className="pointer-events-auto relative z-10 mt-2.5 max-w-sm">
                        <VariantSelector
                            variants={variants}
                            selectedIndex={selectedIndex}
                            onSelect={onSelectVariant}
                        />
                    </div>
                )}
            </div>
        </article>
    );
}
