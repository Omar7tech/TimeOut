import { useScheduleDayDesign } from '@/hooks/use-schedule-day-design';
import { cn } from '@/lib/utils';
import type { ScheduleDay } from '@/types';

/** Day names indexed by ISO weekday (1 = Monday .. 7 = Sunday). */
export const DAYS: Record<number, { arabic: string; english: string }> = {
    1: { arabic: 'الإثنين', english: 'Mon' },
    2: { arabic: 'الثلاثاء', english: 'Tue' },
    3: { arabic: 'الأربعاء', english: 'Wed' },
    4: { arabic: 'الخميس', english: 'Thu' },
    5: { arabic: 'الجمعة', english: 'Fri' },
    6: { arabic: 'السبت', english: 'Sat' },
    7: { arabic: 'الأحد', english: 'Sun' },
};

/** Today's ISO weekday (1 = Monday .. 7 = Sunday). */
export function todayIso(): number {
    const day = new Date().getDay();

    return day === 0 ? 7 : day;
}

/** The day of the month for an ISO weekday in the current week. */
function dateOf(isoDay: number): number {
    const now = new Date();
    const date = new Date(now);
    date.setDate(now.getDate() + (isoDay - todayIso()));

    return date.getDate();
}

interface DayPickerProps {
    schedule: ScheduleDay[];
    /** The chosen ISO weekday. */
    day: number;
    onSelect: (day: number) => void;
}

/**
 * The row of days at the top of the weekly schedule, in the design chosen
 * from the dashboard: a calendar strip (default), a card per day, or compact
 * chips. All three run right to left, mark today, and share one behaviour.
 */
export function ScheduleDayPicker(props: DayPickerProps) {
    const design = useScheduleDayDesign();

    if (design === 'cards') {
        return <CardsPicker {...props} />;
    }

    if (design === 'chips') {
        return <ChipsPicker {...props} />;
    }

    return <CalendarPicker {...props} />;
}

/** Shared tab semantics for every day button. */
function tabProps(item: ScheduleDay, day: number, onSelect: (day: number) => void) {
    return {
        type: 'button' as const,
        role: 'tab',
        'aria-selected': item.day === day,
        'aria-label': `${DAYS[item.day].arabic} · ${DAYS[item.day].english}`,
        onClick: () => onSelect(item.day),
    };
}

const focus =
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

/* -------------------------------------------------------------------------- */
/* Design 1 — Calendar (default)                                              */
/* -------------------------------------------------------------------------- */

/**
 * All seven days in one bar, like a calendar: the short day name over the
 * date, and the dish count under it. Fits a phone without scrolling.
 */
function CalendarPicker({ schedule, day, onSelect }: DayPickerProps) {
    const today = todayIso();

    return (
        <div
            role="tablist"
            aria-label="Day of the week"
            dir="rtl"
            className="grid grid-cols-7 gap-1 rounded-[1.375rem] bg-card p-1.5 ring-1 ring-border"
        >
            {schedule.map((item) => {
                const selected = item.day === day;
                const current = item.day === today;
                const count = item.products.length;

                return (
                    <button
                        key={item.day}
                        {...tabProps(item, day, onSelect)}
                        className={cn(
                            'flex min-w-0 flex-col items-center gap-1.5 rounded-2xl py-2.5 transition-[background-color,color,scale] duration-200 active:scale-[0.96]',
                            focus,
                            selected
                                ? 'bg-foreground text-background'
                                : 'text-foreground hover:bg-muted',
                            !selected && count === 0 && 'text-foreground/35',
                        )}
                    >
                        <span
                            className={cn(
                                'max-w-full truncate px-0.5 text-[0.625rem] leading-none font-medium',
                                selected
                                    ? 'text-background/60'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {DAYS[item.day].arabic}
                        </span>
                        <span
                            className={cn(
                                'grid size-9 place-items-center rounded-full font-display text-lg leading-none font-bold tabular-nums',
                                current &&
                                    !selected &&
                                    'text-brand-red-ink ring-2 ring-brand-red',
                                current && selected && 'bg-brand-red text-brand-ink',
                            )}
                        >
                            {dateOf(item.day)}
                        </span>
                        <span
                            className={cn(
                                'text-[0.625rem] leading-none tabular-nums',
                                selected
                                    ? 'text-background/60'
                                    : 'text-muted-foreground',
                                count === 0 && 'opacity-0',
                            )}
                        >
                            {count} طبق
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 2 — Cards                                                           */
/* -------------------------------------------------------------------------- */

/**
 * A card per day, scrolling sideways on a phone and seven across on a desk:
 * the Arabic day name large, with "اليوم" or the English day and the dish
 * count under it.
 */
function CardsPicker({ schedule, day, onSelect }: DayPickerProps) {
    const today = todayIso();

    return (
        <div
            role="tablist"
            aria-label="Day of the week"
            dir="rtl"
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:grid md:grid-cols-7 md:px-0"
        >
            {schedule.map((item) => {
                const selected = item.day === day;
                const current = item.day === today;
                const count = item.products.length;

                return (
                    <button
                        key={item.day}
                        {...tabProps(item, day, onSelect)}
                        className={cn(
                            'flex min-h-[4.75rem] min-w-[5.5rem] shrink-0 flex-col justify-between gap-2 rounded-2xl p-3 text-start ring-1 transition-[background-color,color,box-shadow,scale] duration-200 active:scale-[0.97]',
                            focus,
                            selected
                                ? 'bg-foreground text-background ring-foreground'
                                : 'bg-card text-foreground ring-border hover:ring-foreground/25',
                            !selected && count === 0 && 'opacity-50',
                        )}
                    >
                        <span className="font-display text-base leading-none font-bold">
                            {DAYS[item.day].arabic}
                        </span>
                        <span
                            className={cn(
                                'flex items-center justify-between gap-2 text-[0.6875rem] leading-none',
                                selected
                                    ? 'text-background/65'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {current ? (
                                <span
                                    className={cn(
                                        'rounded-full px-1.5 py-0.5 font-semibold',
                                        selected
                                            ? 'bg-brand-red text-brand-ink'
                                            : 'bg-brand-red/15 text-brand-red-ink',
                                    )}
                                >
                                    اليوم
                                </span>
                            ) : (
                                <span
                                    dir="ltr"
                                    className="font-medium tracking-wider uppercase"
                                >
                                    {DAYS[item.day].english}
                                </span>
                            )}
                            <span className="font-display font-bold tabular-nums">
                                {count}
                            </span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 3 — Chips                                                           */
/* -------------------------------------------------------------------------- */

/**
 * The lightest option: a row of rounded chips with just the day's name, today
 * picked out in orange text. Wraps rather than scrolls.
 */
function ChipsPicker({ schedule, day, onSelect }: DayPickerProps) {
    const today = todayIso();

    return (
        <div
            role="tablist"
            aria-label="Day of the week"
            dir="rtl"
            className="flex flex-wrap gap-2"
        >
            {schedule.map((item) => {
                const selected = item.day === day;
                const current = item.day === today;
                const count = item.products.length;

                return (
                    <button
                        key={item.day}
                        {...tabProps(item, day, onSelect)}
                        className={cn(
                            'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-[background-color,color,scale] duration-200 active:scale-[0.97]',
                            focus,
                            selected
                                ? 'bg-foreground text-background'
                                : 'bg-muted text-foreground/80 hover:bg-raised hover:text-foreground',
                            !selected && count === 0 && 'opacity-50',
                            !selected && current && 'text-brand-red-ink',
                        )}
                    >
                        {current ? 'اليوم' : DAYS[item.day].arabic}
                        {count > 0 && (
                            <span
                                className={cn(
                                    'font-display text-xs font-bold tabular-nums',
                                    selected
                                        ? 'text-background/60'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
