import { ProductPrice } from '@/components/menu/product-price';
import { VariantSelector } from '@/components/menu/variant-selector';
import { SmartImage } from '@/components/smart-image';
import {
    AddButton,
    BidiText,
    CardTarget,
    PhotoBadges,
    PrepTime,
    ProductInitial,
    ProductMarks,
    ViewButton,
} from './parts';
import type { ProductCardViewProps } from './types';

/**
 * Classic design (the default): the photo at the start, beside it the name in
 * the display face (up to two lines), the note and description, and a foot row
 * with the price, the prep time and the add button. The card takes the
 * direction of the dish's name, and each line of text keeps its own language's
 * direction while sharing the card's edge, so Arabic and English mix cleanly.
 * The whole card opens the dish.
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
    // The note under the name, and the longer description only when there is
    // no note, so the card never runs to more than two lines of copy.
    const note = product.subtitle ?? product.description;

    return (
        <article
            dir={rtl ? 'rtl' : 'ltr'}
            className="group relative flex h-full flex-col gap-3 rounded-[1.5rem] bg-card p-3 text-card-foreground ring-1 ring-border transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgb(0_0_0/0.55)] hover:ring-brand-red/40"
        >
            <CardTarget title={product.title} onOpen={onOpen} />

            <div className="pointer-events-none flex flex-1 gap-3.5">
                <div className="relative size-[7.25rem] shrink-0 overflow-hidden rounded-[1.1rem] md:size-32">
                    {image ? (
                        <SmartImage
                            src={image}
                            alt={product.title}
                            className="size-full"
                            imgClassName="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                            draggable={false}
                        />
                    ) : (
                        <ProductInitial
                            title={product.title}
                            category={fallbackCategory}
                            className="size-full"
                        />
                    )}
                    <PhotoBadges
                        product={product}
                        basePrice={basePrice}
                        discountPrice={discountPrice}
                    />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                    <ProductMarks product={product} className="mb-1.5" />

                    <BidiText
                        as="h2"
                        rtl={rtl}
                        className="line-clamp-2 font-display text-[1.0625rem] leading-snug font-bold md:text-lg"
                    >
                        {product.title}
                    </BidiText>

                    {note && (
                        <BidiText
                            rtl={rtl}
                            className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted-foreground"
                        >
                            {note}
                        </BidiText>
                    )}

                    <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                        <div className="flex flex-col gap-1">
                            <ProductPrice
                                basePrice={basePrice}
                                discountPrice={discountPrice}
                            />
                            <PrepTime minutes={product.preparation_time} />
                        </div>

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
