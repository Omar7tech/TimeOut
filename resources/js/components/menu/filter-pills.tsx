import { CalendarRange, Check, ChevronDown, LayoutGrid, Sun } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CategoryIcon } from '@/components/menu/category-icon';
import { useMenuFilterDesign } from '@/hooks/use-menu-filter-design';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

export type MenuFilter = number | 'today' | 'schedule';

interface FilterPillsProps {
    categories: Category[];
    activeId: MenuFilter;
    onSelect: (id: MenuFilter) => void;
    /** Back to the sections overview; omit to hide the "All" control. */
    onReset?: () => void;
    /** Whether to show the weekly schedule option. */
    showSchedule?: boolean;
}

/**
 * The menu's section switcher, in the design chosen from the dashboard
 * settings: a scrolling rail of photo pills (default), wrapping chips, or a
 * compact dropdown. All three share the same props and selection behaviour.
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
        const position = Math.abs(el.scrollLeft);

        setEdges({
            start: position > 1,
            end: position < max - 1,
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
    const fade = '2.5rem';

    return edges.start && edges.end
        ? `linear-gradient(to right, transparent, #000 ${fade}, #000 calc(100% - ${fade}), transparent)`
        : edges.end
          ? `linear-gradient(to right, #000 calc(100% - ${fade}), transparent)`
          : edges.start
            ? `linear-gradient(to right, transparent, #000 ${fade})`
            : undefined;
}

/** Shared pill look: a soft track colour at rest, solid ink when chosen. */
const pill =
    'inline-flex min-h-11 shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[background-color,color,scale] duration-200 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';
const idle = 'bg-muted text-foreground/80 hover:bg-raised hover:text-foreground';
const chosen = 'bg-foreground text-background';
const chosenToday = 'bg-brand-yellow text-black';

/* -------------------------------------------------------------------------- */
/* Design 1 — Pills (default)                                                 */
/* -------------------------------------------------------------------------- */

/**
 * One scrolling rail: "All", Today, the schedule, then every section as a pill
 * with its photograph. The chosen pill is filled in ink and scrolled into view,
 * so on a phone the rail always shows where you are.
 */
function PillsFilter({
    categories,
    activeId,
    onSelect,
    onReset,
    showSchedule = false,
}: FilterPillsProps) {
    const { scrollRef, edges } = useScrollEdges(categories);
    const maskImage = edgeMask(edges);

    // Keep the chosen pill in view as the selection changes.
    // Only the rail scrolls, never the page, so this can't tug the page about.
    useEffect(() => {
        const rail = scrollRef.current;
        const el = rail?.querySelector<HTMLElement>('[aria-pressed="true"]');

        if (!rail || !el) {
            return;
        }

        const railBox = rail.getBoundingClientRect();
        const box = el.getBoundingClientRect();
        const offset =
            box.left - railBox.left - (railBox.width - box.width) / 2;

        rail.scrollBy({ left: offset, behavior: 'smooth' });
    }, [activeId, scrollRef]);

    return (
        <div
            ref={scrollRef}
            style={{ maskImage, WebkitMaskImage: maskImage }}
            className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 py-1 md:-mx-6 md:scroll-px-6 md:px-6"
        >
            {onReset && (
                <button
                    type="button"
                    onClick={onReset}
                    aria-label="All sections · كل الأقسام"
                    className={cn(pill, idle, 'w-11 justify-center')}
                >
                    <LayoutGrid className="size-[1.125rem]" />
                </button>
            )}

            <button
                type="button"
                aria-pressed={activeId === 'today'}
                onClick={() => onSelect('today')}
                className={cn(
                    pill,
                    'px-4',
                    activeId === 'today' ? chosenToday : idle,
                )}
            >
                <Sun className="size-4" strokeWidth={2.4} />
                اليوم · Today
            </button>

            {showSchedule && (
                <button
                    type="button"
                    aria-pressed={activeId === 'schedule'}
                    onClick={() => onSelect('schedule')}
                    className={cn(
                        pill,
                        'px-4',
                        activeId === 'schedule' ? chosen : idle,
                    )}
                >
                    <CalendarRange className="size-4" />
                    الجدول · Week
                </button>
            )}

            <span aria-hidden className="mx-1 w-px shrink-0 self-stretch bg-border" />

            {categories.map((category) => {
                const active = category.id === activeId;

                return (
                    <button
                        key={category.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onSelect(category.id)}
                        className={cn(
                            pill,
                            'ps-1.5 pe-4',
                            active ? chosen : idle,
                        )}
                    >
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-red text-brand-ink">
                            <CategoryIcon
                                category={category}
                                className="size-[1.125rem]"
                            />
                        </span>
                        <span dir="auto">{category.title}</span>
                    </button>
                );
            })}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 2 — Chips                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Every option visible at once: chips that wrap onto as many lines as needed,
 * nothing scrolling sideways, so every section is one tap away on a phone.
 */
function ChipsFilter({
    categories,
    activeId,
    onSelect,
    onReset,
    showSchedule = false,
}: FilterPillsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {onReset && (
                <button
                    type="button"
                    onClick={onReset}
                    className={cn(pill, idle, 'px-4')}
                >
                    <LayoutGrid className="size-4" />
                    الكل · All
                </button>
            )}

            <button
                type="button"
                aria-pressed={activeId === 'today'}
                onClick={() => onSelect('today')}
                className={cn(
                    pill,
                    'px-4',
                    activeId === 'today' ? chosenToday : idle,
                )}
            >
                <Sun className="size-4" strokeWidth={2.4} />
                اليوم · Today
            </button>

            {showSchedule && (
                <button
                    type="button"
                    aria-pressed={activeId === 'schedule'}
                    onClick={() => onSelect('schedule')}
                    className={cn(
                        pill,
                        'px-4',
                        activeId === 'schedule' ? chosen : idle,
                    )}
                >
                    <CalendarRange className="size-4" />
                    الجدول · Week
                </button>
            )}

            {categories.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    aria-pressed={category.id === activeId}
                    onClick={() => onSelect(category.id)}
                    className={cn(
                        pill,
                        'px-4',
                        category.id === activeId ? chosen : idle,
                    )}
                >
                    <span dir="auto">{category.title}</span>
                </button>
            ))}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 3 — Dropdown                                                        */
/* -------------------------------------------------------------------------- */

/**
 * A space-saving control: Today and the schedule beside a dropdown listing
 * every section. The trigger names the open section, so the whole filter stays
 * on one tidy row however long the menu is.
 */
function DropdownFilter({
    categories,
    activeId,
    onSelect,
    onReset,
    showSchedule = false,
}: FilterPillsProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close the menu when clicking anywhere outside it, or on Escape.
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
        const handleKey = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open]);

    const activeCategory =
        typeof activeId === 'number'
            ? (categories.find((category) => category.id === activeId) ?? null)
            : null;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div ref={containerRef} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    className={cn(
                        pill,
                        'px-4',
                        activeCategory ? chosen : idle,
                    )}
                >
                    <span dir="auto">
                        {activeCategory?.title ?? 'الأقسام · Sections'}
                    </span>
                    <ChevronDown
                        className={cn(
                            'size-4 transition-transform duration-200',
                            open && 'rotate-180',
                        )}
                    />
                </button>

                {open && (
                    <ul
                        role="listbox"
                        className="absolute start-0 z-40 mt-2 max-h-80 w-64 animate-in overflow-y-auto rounded-2xl bg-popover p-1.5 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.5)] ring-1 ring-border fade-in-0 zoom-in-95"
                    >
                        {categories.map((category) => {
                            const active = category.id === activeId;

                            return (
                                <li
                                    key={category.id}
                                    role="option"
                                    aria-selected={active}
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onSelect(category.id);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            'flex min-h-11 w-full items-center gap-3 rounded-xl px-2.5 text-start text-sm font-semibold transition-colors',
                                            active
                                                ? 'bg-muted text-foreground'
                                                : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                                        )}
                                    >
                                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-red text-brand-ink">
                                            <CategoryIcon
                                                category={category}
                                                className="size-[1.125rem]"
                                            />
                                        </span>
                                        <span dir="auto" className="flex-1">
                                            {category.title}
                                        </span>
                                        {active && (
                                            <Check className="size-4 text-brand-red-ink" />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <button
                type="button"
                aria-pressed={activeId === 'today'}
                onClick={() => onSelect('today')}
                className={cn(
                    pill,
                    'px-4',
                    activeId === 'today' ? chosenToday : idle,
                )}
            >
                <Sun className="size-4" strokeWidth={2.4} />
                اليوم
            </button>

            {showSchedule && (
                <button
                    type="button"
                    aria-pressed={activeId === 'schedule'}
                    onClick={() => onSelect('schedule')}
                    className={cn(
                        pill,
                        'px-4',
                        activeId === 'schedule' ? chosen : idle,
                    )}
                >
                    <CalendarRange className="size-4" />
                    الجدول
                </button>
            )}

            {onReset && (
                <button
                    type="button"
                    onClick={onReset}
                    aria-label="All sections · كل الأقسام"
                    className={cn(pill, idle, 'w-11 justify-center')}
                >
                    <LayoutGrid className="size-[1.125rem]" />
                </button>
            )}
        </div>
    );
}
