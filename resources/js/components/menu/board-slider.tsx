import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { Star } from 'lucide-react';
import { useMemo } from 'react';
import { DietIcons } from '@/components/menu/diet-icons';
import { ProductPrice } from '@/components/menu/product-price';
import { SmartImage } from '@/components/smart-image';
import { cn, isArabic } from '@/lib/utils';
import type { BoardLayout, Product, Slide } from '@/types';

interface BoardSliderProps {
    slides: Slide[];
    /** Seconds each slide stays on screen before auto-advancing. */
    rotationSeconds: number;
    /** Whether product slides show their prices. */
    showPrices: boolean;
    /** How each slide is presented on the screen. */
    layout: BoardLayout;
}

/** Where a slide's details sit, which drives their alignment. */
type Align = 'start' | 'center';

/**
 * Full-screen, non-interactive carousel for an in-store Smart TV. Each slide
 * fills the screen and auto-advances; there are no buttons, dialogs, or drag —
 * nothing on a display board is meant to be touched. The `layout` chooses how a
 * slide is presented: a full-bleed spotlight, an image/details split, or a
 * banner bar. A slide linked to a product shows that product's details (title,
 * description, diet markers and every variant price); plain slides show just the
 * image and optional caption.
 */
export function BoardSlider({
    slides,
    rotationSeconds,
    showPrices,
    layout,
}: BoardSliderProps) {
    // Clamp to a sane floor so a misconfigured 0 can't freeze on one slide.
    const delay = Math.max(rotationSeconds, 2) * 1000;
    const plugins = useMemo(
        () => [
            Autoplay({
                delay,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
            }),
        ],
        [delay],
    );
    const [emblaRef] = useEmblaCarousel(
        // One slide at a time, looping, with all touch/drag interaction disabled.
        { loop: true, align: 'start', watchDrag: false },
        plugins,
    );

    if (slides.length === 0) {
        return null;
    }

    return (
        <section
            aria-label="Menu board"
            className="h-full w-full select-none"
            ref={emblaRef}
        >
            <div className="flex h-full">
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="relative flex h-full min-w-0 flex-[0_0_100%] items-stretch"
                    >
                        <BoardSlideView
                            slide={slide}
                            layout={layout}
                            showPrices={showPrices}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

function BoardSlideView({
    slide,
    layout,
    showPrices,
}: {
    slide: Slide;
    layout: BoardLayout;
    showPrices: boolean;
}) {
    switch (layout) {
        case 'split':
            return <SplitSlide slide={slide} showPrices={showPrices} />;
        case 'banner':
            return <BannerSlide slide={slide} showPrices={showPrices} />;
        default:
            return <SpotlightSlide slide={slide} showPrices={showPrices} />;
    }
}

/** Default: full-bleed image with the details over a bottom gradient. */
export function SpotlightSlide({
    slide,
    showPrices,
}: {
    slide: Slide;
    showPrices: boolean;
}) {
    return (
        <div className="relative h-full w-full overflow-hidden">
            <SlideImage slide={slide} />

            {/* Darken the lower half so the details stay readable over any image. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-8 md:p-14 lg:p-20">
                {slide.text && <SlideCaption text={slide.text} align="start" />}
                {slide.product && (
                    <ProductDetails
                        product={slide.product}
                        showPrices={showPrices}
                        align="start"
                    />
                )}
            </div>
        </div>
    );
}

/** Image on one half, the details on a solid panel on the other. */
function SplitSlide({
    slide,
    showPrices,
}: {
    slide: Slide;
    showPrices: boolean;
}) {
    // Put the panel on the side that reads first for the slide's language.
    const rtl = isArabic(slide.product?.title ?? slide.text ?? '');

    return (
        <div
            className={cn(
                'flex h-full w-full overflow-hidden',
                rtl && 'flex-row-reverse',
            )}
        >
            <div className="relative h-full w-1/2">
                <SlideImage slide={slide} />
            </div>

            <div className="flex h-full w-1/2 flex-col justify-center gap-6 bg-neutral-950 p-8 md:p-12 lg:p-16">
                {slide.text && <SlideCaption text={slide.text} align="start" />}
                {slide.product && (
                    <ProductDetails
                        product={slide.product}
                        showPrices={showPrices}
                        align="start"
                    />
                )}
            </div>
        </div>
    );
}

/** Full-bleed image with the details centered in a solid bottom bar. */
function BannerSlide({
    slide,
    showPrices,
}: {
    slide: Slide;
    showPrices: boolean;
}) {
    return (
        <div className="relative h-full w-full overflow-hidden">
            <SlideImage slide={slide} />

            <div className="absolute inset-x-0 bottom-0 border-t-4 border-brand-red bg-black/70 backdrop-blur-md">
                <div className="flex flex-col items-center gap-4 p-6 md:p-10">
                    {slide.text && (
                        <SlideCaption text={slide.text} align="center" />
                    )}
                    {slide.product && (
                        <ProductDetails
                            product={slide.product}
                            showPrices={showPrices}
                            align="center"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/** The slide's image (or a neutral fill), sized to cover its container. */
function SlideImage({ slide }: { slide: Slide }) {
    if (!slide.image) {
        return <div className="absolute inset-0 bg-neutral-900" />;
    }

    return (
        <SmartImage
            src={slide.image}
            alt={slide.product?.title ?? 'Featured'}
            className="absolute inset-0 h-full w-full"
            imgClassName="object-cover"
            loading="eager"
            draggable={false}
        />
    );
}

function SlideCaption({ text, align }: { text: string; align: Align }) {
    const rtl = isArabic(text);
    const center = align === 'center';

    return (
        <p
            dir={rtl ? 'rtl' : undefined}
            className={cn(
                'max-w-5xl text-2xl font-semibold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] md:text-4xl',
                center
                    ? 'self-center text-center'
                    : rtl
                      ? 'self-end text-right'
                      : 'self-start',
            )}
        >
            {text}
        </p>
    );
}

function ProductDetails({
    product,
    showPrices,
    align,
}: {
    product: Product;
    showPrices: boolean;
    align: Align;
}) {
    const variants = product.variants ?? [];
    const hasVariants = variants.length > 0;
    const rtl = isArabic(product.title);
    const center = align === 'center';

    return (
        <div
            dir={rtl ? 'rtl' : undefined}
            className={cn(
                'flex max-w-5xl flex-col gap-4',
                // Centered for the banner; otherwise anchored to the screen edge
                // that matches the language (right for Arabic, left otherwise).
                center
                    ? 'items-center self-center text-center'
                    : rtl
                      ? 'items-end self-end text-right'
                      : 'items-start self-start',
            )}
        >
            <div
                className={cn(
                    'flex items-center gap-4',
                    !center && rtl && 'flex-row-reverse',
                )}
            >
                <h2 className="text-5xl leading-none font-black tracking-tight text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] md:text-7xl">
                    {product.title}
                </h2>
                {product.is_featured && (
                    <Star className="size-9 shrink-0 fill-brand-yellow text-brand-yellow md:size-12" />
                )}
                <DietIcons
                    product={product}
                    iconClassName="size-8 md:size-10"
                />
            </div>

            {product.subtitle && (
                <p className="text-2xl font-semibold text-white/90 md:text-3xl">
                    {product.subtitle}
                </p>
            )}

            {product.description && (
                <p className="max-w-4xl text-xl text-white/75 md:text-2xl">
                    {product.description}
                </p>
            )}

            {showPrices &&
                (hasVariants ? (
                    <div
                        className={cn(
                            'mt-1 flex flex-wrap gap-3',
                            center ? 'justify-center' : rtl && 'justify-end',
                        )}
                    >
                        {variants.map((variant, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 rounded-xl border-2 border-black bg-black/40 px-4 py-2.5 backdrop-blur-sm"
                            >
                                <span className="text-lg font-bold tracking-wide text-white uppercase md:text-xl">
                                    {variant.name}
                                </span>
                                <ProductPrice
                                    basePrice={variant.price}
                                    discountPrice={variant.discount_price}
                                    size="lg"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <ProductPrice
                        basePrice={product.price}
                        discountPrice={product.discount_price}
                        size="lg"
                        className="mt-1 text-2xl md:text-3xl"
                    />
                ))}
        </div>
    );
}
