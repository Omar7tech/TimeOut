import { CalendarRange } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

export type MenuFilter = number | 'today' | 'schedule';

interface FilterPillsProps {
    categories: Category[];
    activeId: MenuFilter;
    onSelect: (id: MenuFilter) => void;
    /** Whether to show the weekly schedule pill. */
    showSchedule?: boolean;
}

const base =
    'shrink-0 snap-start whitespace-nowrap rounded-md border-2 border-black font-bold uppercase tracking-wide transition-all px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base';

/** Resting state: hard offset shadow that lifts on hover. */
const raised =
    'shadow-[3px_3px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] md:shadow-[4px_4px_0_0_#000] md:hover:shadow-[5px_5px_0_0_#000]';

/** Active state: pressed into the shadow. */
const pressed = 'translate-x-[3px] translate-y-[3px] shadow-none';

/** Polka-dot texture layered over the active pill's fill. */
const stripesOnDark =
    '[background-image:radial-gradient(rgba(255,255,255,0.22)_1.5px,transparent_1.5px)] [background-size:8px_8px]';
const stripesOnLight =
    '[background-image:radial-gradient(rgba(0,0,0,0.14)_1.5px,transparent_1.5px)] [background-size:8px_8px]';

/**
 * Neo-brutalist filter pills above the products: a yellow "Available today"
 * pill first, then one per category. Selecting one swaps the products client-side.
 */
export function FilterPills({
    categories,
    activeId,
    onSelect,
    showSchedule = false,
}: FilterPillsProps) {
    const todayActive = activeId === 'today';
    const scheduleActive = activeId === 'schedule';

    // Fade whichever edge of the category row still has hidden pills, so it reads
    // as scrollable on mobile (a right-edge fade on load is the "scroll me" cue).
    const scrollRef = useRef<HTMLDivElement>(null);
    const [edges, setEdges] = useState({ start: false, end: false });

    const updateEdges = useCallback((): void => {
        const el = scrollRef.current;

        if (!el) {
            return;
        }

        const max = el.scrollWidth - el.clientWidth;

        setEdges({
            start: el.scrollLeft > 1,
            end: el.scrollLeft < max - 1,
        });
    }, []);

    useEffect(() => {
        const el = scrollRef.current;

        if (!el) {
            return;
        }

        updateEdges();
        el.addEventListener('scroll', updateEdges, { passive: true });

        const observer = new ResizeObserver(updateEdges);
        observer.observe(el);

        return () => {
            el.removeEventListener('scroll', updateEdges);
            observer.disconnect();
        };
    }, [updateEdges, categories]);

    const fade = '2rem';
    const maskImage =
        edges.start && edges.end
            ? `linear-gradient(to right, transparent, #000 ${fade}, #000 calc(100% - ${fade}), transparent)`
            : edges.end
              ? `linear-gradient(to right, #000 calc(100% - ${fade}), transparent)`
              : edges.start
                ? `linear-gradient(to right, transparent, #000 ${fade})`
                : undefined;

    return (
        // Mobile: categories scroll on top, Today/Schedule sit in a row underneath.
        // Desktop: both groups collapse (md:contents) into one wrapping row, with
        // Today/Schedule first — exactly as before.
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-start md:gap-3">
            {/* Today + Schedule — above the categories on mobile, first on desktop. */}
            <div className="order-1 flex gap-2 md:contents">
                <button
                    type="button"
                    onClick={() => onSelect('today')}
                    className={cn(
                        base,
                        'flex-1 text-center md:flex-none',
                        'bg-brand-yellow text-black',
                        todayActive ? cn(pressed, stripesOnLight) : raised,
                    )}
                >
                    Today - اليوم
                </button>

                {showSchedule && (
                    <button
                        type="button"
                        onClick={() => onSelect('schedule')}
                        className={cn(
                            base,
                            'inline-flex flex-1 items-center justify-center gap-1.5 md:flex-none',
                            scheduleActive
                                ? cn(
                                      'bg-brand-red text-white',
                                      pressed,
                                      stripesOnDark,
                                  )
                                : cn('bg-white text-black', raised),
                        )}
                    >
                        <CalendarRange className="size-4" />
                        Schedule - الجدول
                    </button>
                )}
            </div>

            {/* Categories — horizontal scroll row on mobile, inline-wrapped on desktop. */}
            <div
                ref={scrollRef}
                style={{ maskImage, WebkitMaskImage: maskImage }}
                className="order-2 -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:contents md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
                {categories.map((category) => {
                    const active = category.id === activeId;

                    return (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => onSelect(category.id)}
                            className={cn(
                                base,
                                active
                                    ? cn(
                                          'bg-brand-red text-white',
                                          pressed,
                                          stripesOnDark,
                                      )
                                    : cn('bg-white text-black', raised),
                            )}
                        >
                            {category.title}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
