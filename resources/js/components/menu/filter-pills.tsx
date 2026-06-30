import { CalendarRange, ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMenuFilterDesign } from '@/hooks/use-menu-filter-design';
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

/**
 * Renders the menu's category filter controls in the design chosen from the
 * dashboard settings: bold pills (default), an underline tab bar, or a compact
 * dropdown. All three share the same props and selection behaviour.
 */
export function FilterPills(props: FilterPillsProps) {
    const design = useMenuFilterDesign();

    if (design === 'chips') {
        return <ChipsFilter {...props} />;
    }

    if (design === 'dropdown') {
        return <DropdownFilter {...props} />;
    }

    return <PillsFilter {...props} />;
}

/**
 * Tracks which horizontal edges of a scroll container still have hidden content,
 * so the row can fade whichever side is scrollable (a "scroll me" cue on mobile).
 */
function useScrollEdges(deps: unknown): {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    edges: { start: boolean; end: boolean };
} {
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
         
    }, [updateEdges, deps]);

    return { scrollRef, edges };
}

/** Builds the CSS mask that fades the scrollable edges of a filter row. */
function edgeMask(edges: { start: boolean; end: boolean }): string | undefined {
    const fade = '2rem';

    return edges.start && edges.end
        ? `linear-gradient(to right, transparent, #000 ${fade}, #000 calc(100% - ${fade}), transparent)`
        : edges.end
          ? `linear-gradient(to right, #000 calc(100% - ${fade}), transparent)`
          : edges.start
            ? `linear-gradient(to right, transparent, #000 ${fade})`
            : undefined;
}

/* -------------------------------------------------------------------------- */
/* Design 1 — Pills (default)                                                 */
/* -------------------------------------------------------------------------- */

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
function PillsFilter({
    categories,
    activeId,
    onSelect,
    showSchedule = false,
}: FilterPillsProps) {
    const todayActive = activeId === 'today';
    const scheduleActive = activeId === 'schedule';

    const { scrollRef, edges } = useScrollEdges(categories);
    const maskImage = edgeMask(edges);

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

/* -------------------------------------------------------------------------- */
/* Design 2 — Chips                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Mobile-first chips: Today and the optional Schedule first, then one chip per
 * category, all wrapping freely onto as many lines as needed. Nothing scrolls
 * sideways, so every option is visible and tappable on a phone. The selected
 * chip is filled (yellow for Today, red otherwise); the rest are soft outlines.
 */
function ChipsFilter({
    categories,
    activeId,
    onSelect,
    showSchedule = false,
}: FilterPillsProps) {
    const chip =
        'rounded-full border px-4 py-2 text-sm font-semibold transition-colors';
    const idle = 'border-border bg-card text-foreground hover:bg-muted';

    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => onSelect('today')}
                className={cn(
                    chip,
                    activeId === 'today'
                        ? 'border-brand-yellow bg-brand-yellow text-black'
                        : idle,
                )}
            >
                Today - اليوم
            </button>

            {showSchedule && (
                <button
                    type="button"
                    onClick={() => onSelect('schedule')}
                    className={cn(
                        chip,
                        'inline-flex items-center gap-1.5',
                        activeId === 'schedule'
                            ? 'border-brand-red bg-brand-red text-white'
                            : idle,
                    )}
                >
                    <CalendarRange className="size-4" />
                    Schedule - الجدول
                </button>
            )}

            {categories.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    onClick={() => onSelect(category.id)}
                    className={cn(
                        chip,
                        category.id === activeId
                            ? 'border-brand-red bg-brand-red text-white'
                            : idle,
                    )}
                >
                    {category.title}
                </button>
            ))}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 3 — Dropdown                                                        */
/* -------------------------------------------------------------------------- */

/**
 * A space-saving control: quick Today and Schedule buttons beside a dropdown
 * that lists every category. The trigger shows the active category's name, so the
 * whole filter stays on one tidy row no matter how many categories there are.
 */
function DropdownFilter({
    categories,
    activeId,
    onSelect,
    showSchedule = false,
}: FilterPillsProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close the menu when clicking anywhere outside it.
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleClick = (event: MouseEvent): void => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClick);

        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const activeCategory =
        typeof activeId === 'number'
            ? (categories.find((category) => category.id === activeId) ?? null)
            : null;

    const quick =
        'rounded-full border-2 border-black px-4 py-1.5 text-sm font-bold tracking-wide uppercase transition-colors md:text-base';

    return (
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button
                type="button"
                onClick={() => onSelect('today')}
                className={cn(
                    quick,
                    activeId === 'today'
                        ? 'bg-brand-yellow text-black'
                        : 'bg-card text-foreground hover:bg-muted',
                )}
            >
                Today - اليوم
            </button>

            {showSchedule && (
                <button
                    type="button"
                    onClick={() => onSelect('schedule')}
                    className={cn(
                        quick,
                        'inline-flex items-center gap-1.5',
                        activeId === 'schedule'
                            ? 'bg-brand-red text-white'
                            : 'bg-card text-foreground hover:bg-muted',
                    )}
                >
                    <CalendarRange className="size-4" />
                    Schedule - الجدول
                </button>
            )}

            <div ref={containerRef} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    className={cn(
                        quick,
                        'inline-flex items-center gap-2',
                        activeCategory
                            ? 'bg-brand-red text-white'
                            : 'bg-card text-foreground hover:bg-muted',
                    )}
                >
                    {activeCategory?.title ?? 'Categories - الأصناف'}
                    <ChevronDown
                        className={cn(
                            'size-4 transition-transform',
                            open && 'rotate-180',
                        )}
                    />
                </button>

                {open && (
                    <ul
                        role="listbox"
                        className="absolute z-20 mt-2 max-h-72 w-56 overflow-y-auto rounded-lg border-2 border-black bg-card p-1 shadow-[4px_4px_0_0_#000]">
                        {categories.map((category) => {
                            const active = category.id === activeId;

                            return (
                                <li key={category.id} role="option" aria-selected={active}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onSelect(category.id);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            'w-full rounded-md px-3 py-2 text-left text-sm font-bold tracking-wide uppercase transition-colors',
                                            active
                                                ? 'bg-brand-red text-white'
                                                : 'text-foreground hover:bg-muted',
                                        )}
                                    >
                                        {category.title}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
