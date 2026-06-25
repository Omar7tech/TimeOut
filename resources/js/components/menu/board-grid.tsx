import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { Star } from 'lucide-react';
import { useMemo } from 'react';
import { DietIcons } from '@/components/menu/diet-icons';
import { ProductPrice } from '@/components/menu/product-price';
import { SmartImage } from '@/components/smart-image';
import { cn, isArabic } from '@/lib/utils';
import type { Slide } from '@/types';

interface BoardGridProps {
    slides: Slide[];
    /** Seconds each page stays on screen before cycling to the next. */
    rotationSeconds: number;
    /** Whether product cards show their prices. */
    showPrices: boolean;
}

/** Most products to fit on one screen before paging to the next. */
const MAX_PER_PAGE = 6;

/**
 * "Grid" display style: shows several slides at once as cards. A product slide
 * shows its photo, title and price; a plain slide shows its image (and caption,
 * if any). When there are more than fit on one screen the grid pages through
 * them, cycling on the board's rotation interval. The column count adapts to how
 * many cards are on the page so 1–2 read large while a full screen stays tidy.
 *
 * Performance: the page split is memoized and only the first page's images load
 * eagerly. Cards use the high-quality webp conversion.
 */
export function BoardGrid({
    slides,
    rotationSeconds,
    showPrices,
}: BoardGridProps) {
    // Every slide gets a card: product slides show details, plain slides show
    // their image (and caption, if any).
    const pages = useMemo(() => {
        const chunks: Slide[][] = [];

        for (let i = 0; i < slides.length; i += MAX_PER_PAGE) {
            chunks.push(slides.slice(i, i + MAX_PER_PAGE));
        }

        return chunks;
    }, [slides]);

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
        { loop: true, align: 'start', watchDrag: false },
        plugins,
    );

    if (pages.length === 0) {
        return (
            <div className="grid h-full place-items-center">
                <p className="text-lg font-semibold text-white/60">
                    No slides to show.
                </p>
            </div>
        );
    }

    return (
        <section
            aria-label="Menu board"
            className="h-full w-full select-none"
            ref={emblaRef}
        >
            <div className="flex h-full">
                {pages.map((pageSlides, pageIndex) => (
                    <div
                        key={pageIndex}
                        className="h-full min-w-0 flex-[0_0_100%]"
                    >
                        <GridPage
                            slides={pageSlides}
                            showPrices={showPrices}
                            eager={pageIndex === 0}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

/** Columns that keep 1–2 items large but pack a full page tidily. */
function columnsClass(count: number): string {
    if (count <= 1) {
        return 'grid-cols-1';
    }

    if (count <= 4) {
        return 'grid-cols-2';
    }

    return 'grid-cols-3';
}

function GridPage({
    slides,
    showPrices,
    eager,
}: {
    slides: Slide[];
    showPrices: boolean;
    eager: boolean;
}) {
    return (
        <div
            className={cn(
                'grid h-full w-full auto-rows-fr gap-5 p-6 md:gap-7 md:p-10',
                columnsClass(slides.length),
            )}
        >
            {slides.map((slide) => (
                <GridCard
                    key={slide.id}
                    slide={slide}
                    showPrices={showPrices}
                    eager={eager}
                />
            ))}
        </div>
    );
}

function GridCard({
    slide,
    showPrices,
    eager,
}: {
    slide: Slide;
    showPrices: boolean;
    eager: boolean;
}) {
    const product = slide.product;

    // Prefer the product's own webp photo; fall back to the slide image. Both
    // are high-quality webp conversions.
    const image = product?.image ?? slide.image;
    const rtl = isArabic(product?.title ?? slide.text ?? '');

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-neutral-800 bg-neutral-900 shadow-lg">
            <div className="relative min-h-0 flex-1">
                {image ? (
                    <SmartImage
                        src={image}
                        alt={product?.title ?? slide.text ?? 'Featured'}
                        className="absolute inset-0 h-full w-full"
                        imgClassName="object-cover"
                        loading={eager ? 'eager' : 'lazy'}
                        draggable={false}
                    />
                ) : (
                    <div className="absolute inset-0 bg-neutral-800" />
                )}
                {product?.is_featured && (
                    <Star className="absolute top-3 right-3 size-7 fill-brand-yellow text-brand-yellow drop-shadow-md" />
                )}
            </div>

            {product ? (
                <div
                    dir={rtl ? 'rtl' : undefined}
                    className={cn(
                        'flex flex-col gap-1.5 p-4',
                        rtl && 'text-right',
                    )}
                >
                    <div
                        className={cn(
                            'flex items-center gap-2',
                            rtl && 'flex-row-reverse',
                        )}
                    >
                        <h3 className="min-w-0 flex-1 truncate text-2xl leading-tight font-black text-white md:text-3xl">
                            {product.title}
                        </h3>
                        <DietIcons product={product} iconClassName="size-6" />
                    </div>

                    {showPrices && (
                        <div className={cn('flex', rtl && 'justify-end')}>
                            <ProductPrice
                                basePrice={product.price}
                                discountPrice={product.discount_price}
                                size="lg"
                            />
                        </div>
                    )}
                </div>
            ) : (
                // Plain slide: show its caption when it has one, else image only.
                slide.text && (
                    <div className="p-4">
                        <h3
                            dir={rtl ? 'rtl' : undefined}
                            className={cn(
                                'truncate text-2xl leading-tight font-black text-white md:text-3xl',
                                rtl && 'text-right',
                            )}
                        >
                            {slide.text}
                        </h3>
                    </div>
                )
            )}
        </div>
    );
}
