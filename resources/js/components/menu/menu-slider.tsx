import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
        <section aria-label="Featured · مميز" className="flex flex-col gap-3">
            <div ref={emblaRef} className="-mx-4 overflow-hidden select-none md:mx-0">
                <div className="ms-1 flex md:-ms-3">
                    {slides.map((slide) => {
                        const image = slide.image ? (
                            <SmartImage
                                src={slide.image}
                                alt={slide.product?.title ?? slide.text ?? 'Featured'}
                                className="aspect-[16/10] w-full sm:aspect-[16/9]"
                                imgClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                draggable={false}
                            />
                        ) : (
                            <div className="aspect-[16/10] w-full bg-surface sm:aspect-[16/9]" />
                        );

                        const productTitle = slide.product?.title ?? null;
                        const text = slide.text ?? null;
                        const rtl = isArabic(productTitle ?? text);

                        const caption =
                            productTitle || text ? (
                                <span
                                    dir={rtl ? 'rtl' : 'ltr'}
                                    className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-4 pt-16 text-start text-white"
                                >
                                    <span className="flex min-w-0 flex-col gap-1">
                                        {productTitle && (
                                            <span className="font-display text-xl leading-tight font-extrabold drop-shadow-sm md:text-2xl">
                                                {productTitle}
                                            </span>
                                        )}
                                        {text && (
                                            <span
                                                dir="auto"
                                                className={cn(
                                                    'line-clamp-2 text-sm leading-snug',
                                                    productTitle
                                                        ? 'text-white/90'
                                                        : 'font-display text-lg font-bold text-white md:text-xl',
                                                )}
                                            >
                                                {text}
                                            </span>
                                        )}
                                    </span>
                                    {slide.product && (
                                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-red text-brand-ink transition-transform duration-300 group-hover:scale-105">
                                            {rtl ? (
                                                <ArrowLeft className="size-5" />
                                            ) : (
                                                <ArrowRight className="size-5" />
                                            )}
                                        </span>
                                    )}
                                </span>
                            ) : null;

                        return (
                            <div
                                key={slide.id}
                                className="min-w-0 flex-[0_0_88%] ps-3 sm:flex-[0_0_60%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                            >
                                {slide.product ? (
                                    <button
                                        type="button"
                                        onClick={() => openSlide(slide)}
                                        aria-label={`View ${slide.product.title}`}
                                        className="group relative block w-full cursor-pointer overflow-hidden rounded-[1.5rem] ring-1 ring-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    >
                                        {image}
                                        {caption}
                                    </button>
                                ) : (
                                    <div className="group relative block w-full overflow-hidden rounded-[1.5rem] ring-1 ring-border">
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
                <div className="flex items-center justify-center gap-0.5">
                    {snaps.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => emblaApi?.scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === selectedSnap}
                            className="group grid h-11 min-w-8 place-items-center rounded-full px-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                            <span
                                className={cn(
                                    'block h-1.5 rounded-full transition-all duration-300',
                                    index === selectedSnap
                                        ? 'w-7 bg-brand-red'
                                        : 'w-1.5 bg-foreground/25 group-hover:bg-foreground/50',
                                )}
                            />
                        </button>
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
