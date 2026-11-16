import { Check, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
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
 * The menu's section switcher, in the design chosen from the dashboard: a
 * sliding sticker (default), sliding tabs, big type, wrapping chips, or a
 * compact dropdown. All are words only, read right to left, and share the
 * same props and behaviour.
 */
export function FilterPills(props: FilterPillsProps) {
    const design = useMenuFilterDesign();

    if (design === 'tabs') {
        return <TabsFilter {...props} />;
    }

    if (design === 'type') {
        return <TypeFilter {...props} />;
    }

    if (design === 'chips') {
        return <ChipsFilter {...props} />;
    }

    if (design === 'dropdown') {
        return <DropdownFilter {...props} />;
    }

    return <StickerFilter {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Shared                                                                     */
/* -------------------------------------------------------------------------- */

/** Every option on the rail, in order: all, today, the week, the sections. */
type Option = {
    key: string;
    label: ReactNode;
    active: boolean;
    onClick: () => void;
    /** "All" isn't a filter, so it never shows as chosen. */
    reset?: boolean;
};

function optionsOf({
    categories,
    activeId,
    onSelect,
    onReset,
    showSchedule = false,
}: FilterPillsProps): Option[] {
    const options: Option[] = [];

    if (onReset) {
        options.push({
            key: 'all',
            label: 'الكل',
            active: false,
            onClick: onReset,
            reset: true,
        });
    }

    options.push({
        key: 'today',
        label: 'اليوم',
        active: activeId === 'today',
        onClick: () => onSelect('today'),
    });

    if (showSchedule) {
        options.push({
            key: 'schedule',
            label: 'الجدول',
            active: activeId === 'schedule',
            onClick: () => onSelect('schedule'),
        });
    }

    for (const category of categories) {
        options.push({
            key: String(category.id),
            label: <span dir="auto">{category.title}</span>,
            active: category.id === activeId,
            onClick: () => onSelect(category.id),
        });
    }

    return options;
}

/**
 * A right-to-left scrolling rail that fades whichever edge still has more to
 * show, keeps the chosen option in view, and reports where that option sits
 * so a marker can slide under it. Only the rail scrolls, never the page.
 */
function useRail(activeKey: MenuFilter, deps: unknown) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [edges, setEdges] = useState({ start: false, end: false });
    const [marker, setMarker] = useState<{
        left: number;
        width: number;
    } | null>(null);

    const updateEdges = useCallback((): void => {
        const el = scrollRef.current;

        if (!el) {
            return;
        }

        const max = el.scrollWidth - el.clientWidth;
        const position = Math.abs(el.scrollLeft);

        setEdges({ start: position > 1, end: position < max - 1 });
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

    useLayoutEffect(() => {
        const rail = scrollRef.current;
        const el = trackRef.current?.querySelector<HTMLElement>(
            '[aria-pressed="true"]',
        );

        if (!rail || !el) {
            setMarker(null);

            return;
        }

        setMarker({ left: el.offsetLeft, width: el.offsetWidth });

        const railBox = rail.getBoundingClientRect();
        const box = el.getBoundingClientRect();

        rail.scrollBy({
            left: box.left - railBox.left - (railBox.width - box.width) / 2,
            behavior: 'smooth',
        });
    }, [activeKey, deps]);

    // The rail reads right to left, so its start is the right-hand edge.
    const fade = '2.5rem';
    const maskImage =
        edges.start && edges.end
            ? `linear-gradient(to left, transparent, #000 ${fade}, #000 calc(100% - ${fade}), transparent)`
            : edges.end
              ? `linear-gradient(to left, #000 calc(100% - ${fade}), transparent)`
              : edges.start
                ? `linear-gradient(to left, transparent, #000 ${fade})`
                : undefined;

    return { scrollRef, trackRef, marker, maskImage };
}

const focus =
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

/** The scrolling frame every rail design sits in. */
function Rail({
    scrollRef,
    trackRef,
    maskImage,
    children,
    className,
}: {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    trackRef: React.RefObject<HTMLDivElement | null>;
    maskImage: string | undefined;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            ref={scrollRef}
            dir="rtl"
            style={{ maskImage, WebkitMaskImage: maskImage }}
            className="-mx-4 no-scrollbar overflow-x-auto px-4 md:-mx-6 md:px-6"
        >
            <div
                ref={trackRef}
                className={cn('relative flex w-max items-center', className)}
            >
                {children}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 1 — Sticker (default)                                               */
/* -------------------------------------------------------------------------- */

/**
 * Plain words in the display face, and one orange pill, tilted like the
 * logo's stickers, that slides from word to word (yellow for today).
 */
function StickerFilter(props: FilterPillsProps) {
    const { scrollRef, trackRef, marker, maskImage } = useRail(
        props.activeId,
        props.categories,
    );
    const today = props.activeId === 'today';
    const options = optionsOf(props);
    // The first section, which gets a dot before it to split it from today.
    const firstSection = options.findIndex(
        (option) => !Number.isNaN(Number(option.key)),
    );

    return (
        <Rail
            scrollRef={scrollRef}
            trackRef={trackRef}
            maskImage={maskImage}
            className="gap-0.5 py-1.5"
        >
            {marker && (
                <span
                    aria-hidden
                    className={cn(
                        'absolute top-1/2 h-10 -translate-y-1/2 rotate-[-2.5deg] rounded-xl transition-[left,width,background-color] duration-400 ease-[cubic-bezier(0.34,1.3,0.64,1)]',
                        today ? 'bg-brand-yellow' : 'bg-brand-red',
                    )}
                    style={{ left: marker.left, width: marker.width }}
                />
            )}

            {options.map((option, index) => (
                <WithDivider key={option.key} divider={index === firstSection}>
                    <button
                        type="button"
                        aria-pressed={option.reset ? undefined : option.active}
                        onClick={option.onClick}
                        className={cn(
                            'relative z-10 inline-flex min-h-11 shrink-0 items-center rounded-xl px-3.5 font-display text-[0.9375rem] font-bold whitespace-nowrap transition-colors duration-300',
                            focus,
                            option.active
                                ? today
                                    ? 'text-black'
                                    : 'text-brand-ink'
                                : 'text-foreground/55 hover:text-foreground',
                        )}
                    >
                        {option.label}
                    </button>
                </WithDivider>
            ))}
        </Rail>
    );
}

/** A small dot before the first section, splitting it from today and the week. */
function WithDivider({
    divider,
    children,
}: {
    divider: boolean;
    children: ReactNode;
}) {
    return (
        <>
            {divider && (
                <span
                    aria-hidden
                    className="mx-1.5 size-1 shrink-0 rounded-full bg-foreground/25"
                />
            )}
            {children}
        </>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 2 — Tabs                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Words on a hairline, with a thick orange bar that slides under the chosen
 * one. The chosen word turns full ink; the rest stay quiet.
 */
function TabsFilter(props: FilterPillsProps) {
    const { scrollRef, trackRef, marker, maskImage } = useRail(
        props.activeId,
        props.categories,
    );

    return (
        <div className="relative">
            <Rail
                scrollRef={scrollRef}
                trackRef={trackRef}
                maskImage={maskImage}
                className="gap-1"
            >
                {marker && (
                    <span
                        aria-hidden
                        className={cn(
                            'absolute bottom-0 h-[3px] rounded-full transition-[left,width,background-color] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
                            props.activeId === 'today'
                                ? 'bg-brand-yellow'
                                : 'bg-brand-red',
                        )}
                        style={{
                            left: marker.left + 10,
                            width: marker.width - 20,
                        }}
                    />
                )}

                {optionsOf(props).map((option) => (
                    <button
                        key={option.key}
                        type="button"
                        aria-pressed={option.reset ? undefined : option.active}
                        onClick={option.onClick}
                        className={cn(
                            'relative inline-flex min-h-12 shrink-0 items-center px-2.5 font-display text-[0.9375rem] font-bold whitespace-nowrap transition-colors duration-300',
                            focus,
                            option.active
                                ? 'text-foreground'
                                : 'text-foreground/45 hover:text-foreground/80',
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </Rail>
            <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 -z-10 h-px bg-border"
            />
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 3 — Big type                                                        */
/* -------------------------------------------------------------------------- */

/**
 * The poster option: the words set big and black-weight, faded back, with
 * the chosen one in solid orange (yellow for today).
 */
function TypeFilter(props: FilterPillsProps) {
    const { scrollRef, trackRef, maskImage } = useRail(
        props.activeId,
        props.categories,
    );
    const today = props.activeId === 'today';

    return (
        <Rail
            scrollRef={scrollRef}
            trackRef={trackRef}
            maskImage={maskImage}
            className="gap-4 py-1"
        >
            {optionsOf(props).map((option) => (
                <button
                    key={option.key}
                    type="button"
                    aria-pressed={option.reset ? undefined : option.active}
                    onClick={option.onClick}
                    className={cn(
                        'inline-flex min-h-12 shrink-0 items-center rounded-lg font-display text-[1.75rem] leading-none font-black whitespace-nowrap transition-[color,scale] duration-300 active:scale-[0.97]',
                        focus,
                        option.active
                            ? today
                                ? 'text-brand-yellow'
                                : 'text-brand-red'
                            : 'text-foreground/20 hover:text-foreground/45',
                    )}
                >
                    {option.label}
                </button>
            ))}
        </Rail>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 4 — Chips                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Every option visible at once: chips that wrap onto as many lines as needed,
 * nothing scrolling sideways. Outlined at rest, solid orange when chosen.
 */
function ChipsFilter(props: FilterPillsProps) {
    return (
        <div dir="rtl" className="flex flex-wrap gap-2">
            {optionsOf(props).map((option) => (
                <button
                    key={option.key}
                    type="button"
                    aria-pressed={option.reset ? undefined : option.active}
                    onClick={option.onClick}
                    className={cn(
                        'inline-flex min-h-10 items-center rounded-full px-4 font-display text-sm font-bold transition-[background-color,color,box-shadow,scale] duration-200 active:scale-[0.97]',
                        focus,
                        option.active
                            ? props.activeId === 'today'
                                ? 'bg-brand-yellow text-black'
                                : 'bg-brand-red text-brand-ink'
                            : 'text-foreground/75 ring-1 ring-border hover:text-foreground hover:ring-foreground/30',
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 5 — Dropdown                                                        */
/* -------------------------------------------------------------------------- */

/**
 * A space-saving control: one button naming where you are, opening a list of
 * every option. The whole filter stays on one tidy row however long the menu.
 */
function DropdownFilter(props: FilterPillsProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const options = optionsOf(props);
    const current = options.find((option) => option.active);

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

    return (
        <div ref={containerRef} dir="rtl" className="relative ml-auto w-fit">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={cn(
                    'inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-red ps-4 pe-3 font-display text-[0.9375rem] font-bold text-brand-ink transition-[scale] duration-200 active:scale-[0.98]',
                    focus,
                )}
            >
                {current?.label ?? 'الأقسام'}
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
                    {options.map((option) => (
                        <li
                            key={option.key}
                            role="option"
                            aria-selected={option.active}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    option.onClick();
                                    setOpen(false);
                                }}
                                className={cn(
                                    'flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 text-start font-display text-sm font-bold transition-colors',
                                    option.active
                                        ? 'bg-muted text-foreground'
                                        : 'text-foreground/75 hover:bg-muted hover:text-foreground',
                                )}
                            >
                                {option.label}
                                {option.active && (
                                    <Check className="size-4 text-brand-red-ink" />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
