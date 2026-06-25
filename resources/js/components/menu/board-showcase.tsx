import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SpotlightSlide } from '@/components/menu/board-slider';
import { ProductPrice } from '@/components/menu/product-price';
import { SmartImage } from '@/components/smart-image';
import { cn, isArabic } from '@/lib/utils';
import type { Slide } from '@/types';

interface BoardShowcaseProps {
    slides: Slide[];
    /** Seconds the hero stays on each slide before advancing. */
    rotationSeconds: number;
    /** Whether prices are shown on the hero and in the sidebar. */
    showPrices: boolean;
}

/**
 * "Showcase" display style: a large rotating hero on one side with a live
 * sidebar listing every slide on the other. As the hero advances, the sidebar
 * highlights and auto-scrolls to the current item, so customers see what is
 * featured now and what is coming up next.
 *
 * Smart: the sidebar only appears when there is more than one slide — a single
 * slide just fills the screen as a plain hero.
 */
export function BoardShowcase({
    slides,
    rotationSeconds,
    showPrices,
}: BoardShowcaseProps) {
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
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'start', watchDrag: false },
        plugins,
    );

    // Track which slide the hero is showing so the sidebar can follow it.
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!emblaApi) {
            return;
        }

        const sync = (): void => setActiveIndex(emblaApi.selectedScrollSnap());

        emblaApi.on('select', sync);
        emblaApi.on('reInit', sync);
        sync();

        return () => {
            emblaApi.off('select', sync);
            emblaApi.off('reInit', sync);
        };
    }, [emblaApi]);

    const showSidebar = slides.length > 1;

    return (
        <div className="flex h-full w-full">
            <div
                ref={emblaRef}
                className={cn(
                    'h-full overflow-hidden',
                    showSidebar ? 'flex-1' : 'w-full',
                )}
            >
                <div className="flex h-full">
                    {slides.map((slide) => (
                        <div
                            key={slide.id}
                            className="relative h-full min-w-0 flex-[0_0_100%]"
                        >
                            <SpotlightSlide
                                slide={slide}
                                showPrices={showPrices}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {showSidebar && (
                <Sidebar
                    slides={slides}
                    activeIndex={activeIndex}
                    showPrices={showPrices}
                />
            )}
        </div>
    );
}

function Sidebar({
    slides,
    activeIndex,
    showPrices,
}: {
    slides: Slide[];
    activeIndex: number;
    showPrices: boolean;
}) {
    const activeRef = useRef<HTMLDivElement>(null);

    // Keep the highlighted item in view as the hero advances.
    useEffect(() => {
        activeRef.current?.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
        });
    }, [activeIndex]);

    return (
        <aside className="flex h-full w-[32%] max-w-md shrink-0 flex-col gap-3 overflow-y-auto border-l-4 border-brand-red bg-neutral-950 p-4 md:p-5">
            {slides.map((slide, index) => (
                <SidebarRow
                    key={slide.id}
                    ref={index === activeIndex ? activeRef : undefined}
                    slide={slide}
                    active={index === activeIndex}
                    showPrices={showPrices}
                />
            ))}
        </aside>
    );
}

function SidebarRow({
    ref,
    slide,
    active,
    showPrices,
}: {
    ref?: React.Ref<HTMLDivElement>;
    slide: Slide;
    active: boolean;
    showPrices: boolean;
}) {
    const product = slide.product;
    const image = product?.image ?? slide.image;
    const title = product?.title ?? slide.text ?? 'Featured';
    const rtl = isArabic(title);

    return (
        <div
            ref={ref}
            dir={rtl ? 'rtl' : undefined}
            className={cn(
                'flex shrink-0 items-center gap-3 rounded-xl border-2 p-2.5 transition-all duration-300',
                rtl && 'flex-row-reverse',
                active
                    ? 'scale-[1.02] border-brand-red bg-white/10'
                    : 'border-transparent bg-white/5 opacity-70',
            )}
        >
            {image ? (
                <SmartImage
                    src={image}
                    alt={title}
                    className="size-16 shrink-0 rounded-lg md:size-20"
                    imgClassName="object-cover"
                    draggable={false}
                />
            ) : (
                <div className="size-16 shrink-0 rounded-lg bg-neutral-800 md:size-20" />
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3
                    className={cn(
                        'truncate text-lg leading-tight font-black text-white md:text-xl',
                        rtl && 'text-right',
                    )}
                >
                    {title}
                </h3>

                {showPrices && product && (
                    <div className={cn('flex', rtl && 'justify-end')}>
                        <ProductPrice
                            basePrice={product.price}
                            discountPrice={product.discount_price}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
