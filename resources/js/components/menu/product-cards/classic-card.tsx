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
 * Classic design (the default): a row with the photograph at the start and the
 * name, a line of description and the price beside it. The card follows the
 * dish's own language, so an Arabic dish reads right to left with its photo on
 * the right. The whole card opens the dish.
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
    fallbackCategory,
}: ProductCardViewProps) {
    const blurb = product.description ?? product.subtitle;

    return (
        <article
            dir={rtl ? 'rtl' : 'ltr'}
            className="group relative flex h-full flex-col gap-3 rounded-[1.25rem] bg-card p-2.5 text-card-foreground ring-1 ring-border transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-18px_rgb(0_0_0/0.45)]"
        >
            <CardTarget title={product.title} onOpen={onOpen} />

            <div className="pointer-events-none flex gap-3.5">
                {image ? (
                    <SmartImage
                        src={image}
                        alt={product.title}
                        className="size-[6.5rem] shrink-0 rounded-[0.9rem] md:size-28"
                        imgClassName="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        draggable={false}
                    />
                ) : (
                    <ProductInitial
                        title={product.title}
                        category={fallbackCategory}
                        className="size-[6.5rem] shrink-0 rounded-[0.9rem] md:size-28"
                    />
                )}

                <div className="flex min-w-0 flex-1 flex-col py-0.5">
                    <ProductMarks product={product} className="mb-1" />

                    <h2 className="line-clamp-1 text-base leading-snug font-semibold md:text-[1.0625rem]">
                        {product.title}
                    </h2>

                    {blurb && (
                        <p className="mt-0.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                            {blurb}
                        </p>
                    )}

                    <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                        <ProductPrice
                            basePrice={basePrice}
                            discountPrice={discountPrice}
                        />

                        <span className="pointer-events-auto">
                            {enableCart ? (
                                <AddButton
                                    title={product.title}
                                    onClick={onQuickAdd}
                                />
                            ) : (
                                <ViewButton
                                    title={product.title}
                                    onClick={onOpen}
                                />
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {hasVariants && (
                <div className="relative z-10">
                    <VariantSelector
                        variants={variants}
                        selectedIndex={selectedIndex}
                        onSelect={onSelectVariant}
                    />
                </div>
            )}
        </article>
    );
}
