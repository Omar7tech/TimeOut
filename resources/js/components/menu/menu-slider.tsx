import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ProductDialog } from '@/components/menu/product-dialog';
import { SmartImage } from '@/components/smart-image';
import type { CartAddon } from '@/contexts/cart-context';
import { useCartActions } from '@/contexts/cart-context';
import { cn, isArabic } from '@/lib/utils';
import type { Slide } from '@/types';

interface MenuSliderProps {
    slides: Slide[];
    /** Whether a slide's product dialog can add to cart (delivery menu only). */
    enableCart?: boolean;
}

/**
 * Promotional carousel shown above the menu. It scrolls a row of image cards —
 * one per view on mobile, up to three on desktop — that auto-advance and
 * support swipe. A slide linked to a product opens that product's details when
 * tapped; plain slides are decorative.
 */
export function MenuSlider({ slides, enableCart = false }: MenuSliderProps) {
    const plugins = useMemo(
        () => [
            Autoplay({
                delay: 4500,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
            }),
        ],
        [],
    );
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'start', containScroll: 'trimSnaps' },
        plugins,
    );

    const [selectedSnap, setSelectedSnap] = useState(0);
    const [snaps, setSnaps] = useState<number[]>([]);

    // The slide whose product details are open, plus its chosen variant.
    const [activeSlide, setActiveSlide] = useState<Slide | null>(null);
    const [variantIndex, setVariantIndex] = useState(0);
    const { addItem } = useCartActions();

    useEffect(() => {
        if (!emblaApi) {
            return;
        }

        const sync = (): void => {
            setSnaps(emblaApi.scrollSnapList());
            setSelectedSnap(emblaApi.selectedScrollSnap());
        };

        emblaApi.on('select', sync);
        emblaApi.on('reInit', sync);
        // Embla is an imperative library; read its initial layout once on mount.
        sync();

        return () => {
            emblaApi.off('select', sync);
            emblaApi.off('reInit', sync);
        };
    }, [emblaApi]);

    if (slides.length === 0) {
        return null;
    }

    const openSlide = (slide: Slide): void => {
        if (!slide.product) {
            return;
        }

        // Default to the last variant, matching the product cards.
        const variants = slide.product.variants ?? [];
        setVariantIndex(variants.length > 0 ? variants.length - 1 : 0);
        setActiveSlide(slide);
    };

    const product = activeSlide?.product ?? null;
    const variants = product?.variants ?? [];
    const hasVariants = variants.length > 0;
    const selectedVariant = hasVariants ? variants[variantIndex] : null;
    const effectivePrice = selectedVariant
        ? (selectedVariant.discount_price ?? selectedVariant.price)
        : (product?.discount_price ?? product?.price ?? 0);

    const addToCart = (selectedAddons: CartAddon[] = []): void => {
        if (!product) {
            return;
        }

        addItem({
            productId: product.id,
            variantIndex: hasVariants ? variantIndex : null,
            title: product.title,
            variantName: selectedVariant?.name ?? null,
            unitUsd: effectivePrice,
            image: product.thumb ?? product.image,
            addons: selectedAddons,
        });
        setActiveSlide(null);
    };

    return (
        <section aria-label="Featured" className="flex flex-col gap-3">
            <div ref={emblaRef} className="overflow-hidden py-1.5">
                <div className="-ml-3 flex">
                    {slides.map((slide) => {
                        const image = slide.image ? (
                            <SmartImage
                                src={slide.image}
                                alt={slide.product?.title ?? 'Featured'}
                                className="aspect-[16/9] w-full"
                                imgClassName="object-cover"
                                loading="eager"
                                draggable={false}
                            />
                        ) : (
                            <div className="aspect-[16/9] w-full bg-muted" />
                        );

                        // The product button (red chip) and, under it, the slide's
                        // optional custom text as plain larger text. Overlay aligns
                        // to the side that matches the text's language.
                        const productTitle = slide.product?.title ?? null;
                        const text = slide.text ?? null;
                        const rtlTitle = productTitle
                            ? isArabic(productTitle)
                            : false;
                        const rtlText = text ? isArabic(text) : false;

                        const caption =
                            productTitle || text ? (
                                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t from-black/70 to-transparent p-2.5">
                                    {slide.product && productTitle && (
                                        <span
                                            dir={rtlTitle ? 'rtl' : undefined}
                                            className={cn(
                                                'inline-flex items-center gap-1 rounded-md bg-brand-red px-2 py-1 text-[11px] font-extrabold tracking-wide text-white uppercase shadow-sm',
                                                rtlTitle ? 'self-end' : 'self-start',
                                            )}
                                        >
                                            {productTitle}
                                            {rtlTitle ? (
                                                <ChevronLeft className="size-3.5" />
                                            ) : (
                                                <ChevronRight className="size-3.5" />
                                            )}
                                        </span>
                                    )}
                                    {text && (
                                        <span
                                            dir={rtlText ? 'rtl' : undefined}
                                            className={cn(
                                                'text-sm font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]',
                                                rtlText
                                                    ? 'self-end text-right'
                                                    : 'self-start text-left',
                                            )}
                                        >
                                            {text}
                                        </span>
                                    )}
                                </span>
                            ) : null;

                        return (
                            <div
                                key={slide.id}
                                className="min-w-0 flex-[0_0_100%] pl-3 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                            >
                                {slide.product ? (
                                    <button
                                        type="button"
                                        onClick={() => openSlide(slide)}
                                        aria-label={`View ${slide.product.title}`}
                                        className="relative block w-full cursor-pointer overflow-hidden rounded-lg shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    >
                                        {image}
                                        {caption}
                                    </button>
                                ) : (
                                    <div className="relative block w-full overflow-hidden rounded-lg shadow-sm">
                                        {image}
                                        {caption}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {snaps.length > 1 && (
                <div className="flex items-center justify-center gap-1.5">
                    {snaps.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => emblaApi?.scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={cn(
                                'h-2 rounded-full border-2 border-black transition-all',
                                index === selectedSnap
                                    ? 'w-6 bg-brand-red'
                                    : 'w-2 bg-card hover:bg-muted',
                            )}
                        />
                    ))}
                </div>
            )}

            {product && (
                <ProductDialog
                    product={product}
                    addons={activeSlide?.addons ?? []}
                    open={activeSlide !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            setActiveSlide(null);
                        }
                    }}
                    selectedIndex={variantIndex}
                    onSelectVariant={setVariantIndex}
                    onAddToCart={enableCart ? addToCart : undefined}
                />
            )}
        </section>
    );
}
