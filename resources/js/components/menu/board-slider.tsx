import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { Star } from 'lucide-react';
import { useMemo } from 'react';
import { DietIcons } from '@/components/menu/diet-icons';
import { ProductPrice } from '@/components/menu/product-price';
import { SmartImage } from '@/components/smart-image';
import { cn, isArabic } from '@/lib/utils';
import type { Product, Slide } from '@/types';

interface BoardSliderProps {
    slides: Slide[];
    /** Seconds each slide stays on screen before auto-advancing. */
    rotationSeconds: number;
}

/**
 * Full-screen, non-interactive carousel for an in-store Smart TV. Each slide
 * fills the screen and auto-advances; there are no buttons, dialogs, or drag —
 * nothing on a display board is meant to be touched. A slide linked to a product
 * shows that product's details (title, description, diet markers and every
 * variant price); plain slides show just the image and optional caption.
 */
export function BoardSlider({ slides, rotationSeconds }: BoardSliderProps) {
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
                        <BoardSlideView slide={slide} />
                    </div>
                ))}
            </div>
        </section>
    );
}

function BoardSlideView({ slide }: { slide: Slide }) {
    const product = slide.product;
    const image = slide.image ? (
        <SmartImage
            src={slide.image}
            alt={product?.title ?? 'Featured'}
            className="absolute inset-0 h-full w-full"
            imgClassName="object-cover"
            loading="eager"
            draggable={false}
        />
    ) : (
        <div className="absolute inset-0 bg-neutral-900" />
    );

    const text = slide.text ?? null;
    const rtlText = text ? isArabic(text) : false;

    return (
        <div className="relative h-full w-full overflow-hidden">
            {image}

            {/* Darken the lower half so the details stay readable over any image. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-8 md:p-14 lg:p-20">
                {text && (
                    <p
                        dir={rtlText ? 'rtl' : undefined}
                        className={cn(
                            'max-w-5xl text-2xl font-semibold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] md:text-4xl',
                            rtlText ? 'self-end text-right' : 'self-start',
                        )}
                    >
                        {text}
                    </p>
                )}

                {product && <ProductDetails product={product} />}
            </div>
        </div>
    );
}

function ProductDetails({ product }: { product: Product }) {
    const variants = product.variants ?? [];
    const hasVariants = variants.length > 0;
    const rtl = isArabic(product.title);

    return (
        <div
            dir={rtl ? 'rtl' : undefined}
            className={cn(
                'flex max-w-5xl flex-col gap-4',
                // Anchor the whole block to the screen edge that matches the
                // language: right for Arabic, left otherwise.
                rtl
                    ? 'items-end self-end text-right'
                    : 'items-start self-start',
            )}
        >
            <div
                className={cn(
                    'flex items-center gap-4',
                    rtl && 'flex-row-reverse',
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

            {hasVariants ? (
                <div
                    className={cn(
                        'mt-1 flex flex-wrap gap-3',
                        rtl && 'justify-end',
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
            )}
        </div>
    );
}
