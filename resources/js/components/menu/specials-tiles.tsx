import { ArrowUpLeft } from 'lucide-react';
import { CategoryIcon } from '@/components/menu/category-icon';
import {
    DAYS,
    dateOf,
    todayIso,
} from '@/components/menu/schedule-day-picker';
import { SmartImage } from '@/components/smart-image';
import { cn } from '@/lib/utils';
import type { Category, Product, ScheduleDay } from '@/types';

/** A dish with the section it sits in, so a missing photo can show its icon. */
export type SpecialDish = { product: Product; category: Category };

/** ISO weekdays, Monday first, for the week tile's day row. */
const WEEK = [1, 2, 3, 4, 5, 6, 7];

const tile =
    'group flex flex-col justify-between gap-3 rounded-[1.375rem] p-4 text-start transition-[translate] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none md:p-5';

/** The small round arrow in a tile's corner. */
function Corner({ className }: { className: string }) {
    return (
        <span
            aria-hidden
            className={cn(
                'grid size-9 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5',
                className,
            )}
        >
            <ArrowUpLeft className="size-4" strokeWidth={2.4} />
        </span>
    );
}

/**
 * Today's specials: the yellow tile with the title, a peek at the dishes
 * (their photos, or their section's icon) and how many are on today.
 */
export function TodayTile({
    specials,
    onOpen,
}: {
    specials: SpecialDish[];
    onOpen: () => void;
}) {
    const peek = specials.slice(0, 3);
    const count = specials.length;

    return (
        <button
            type="button"
            onClick={onOpen}
            dir="rtl"
            className={cn(tile, 'bg-brand-yellow text-black')}
        >
            <span className="flex items-start justify-between gap-3">
                <span className="flex flex-col">
                    <span
                        dir="ltr"
                        className="self-end text-[0.6875rem] font-bold tracking-[0.16em] text-black/60 uppercase"
                    >
                        Today's specials
                    </span>
                    <span className="font-display text-3xl leading-tight font-black">
                        أطباق اليوم
                    </span>
                </span>
                <Corner className="bg-black text-brand-yellow" />
            </span>

            <span className="flex items-center gap-2.5">
                {peek.length > 0 && (
                    <span className="flex -space-x-2.5 rtl:space-x-reverse">
                        {peek.map(({ product, category }) => {
                            const image = product.thumb ?? product.image;

                            return image ? (
                                <SmartImage
                                    key={product.id}
                                    src={image}
                                    alt=""
                                    className="size-9 rounded-full ring-2 ring-brand-yellow"
                                    imgClassName="object-cover"
                                    draggable={false}
                                />
                            ) : (
                                <span
                                    key={product.id}
                                    className="grid size-9 place-items-center rounded-full bg-black text-brand-yellow ring-2 ring-brand-yellow"
                                >
                                    <CategoryIcon
                                        category={category}
                                        className="size-[1.125rem]"
                                    />
                                </span>
                            );
                        })}
                    </span>
                )}
                <span className="text-sm font-semibold">
                    {count > 0
                        ? `${count} ${count > 2 && count < 11 ? 'أطباق' : 'طبق'} اليوم`
                        : 'ما في أطباق خاصة اليوم'}
                </span>
            </span>
        </button>
    );
}

/**
 * The weekly schedule: the title and the week as one strip of seven cells,
 * each with its day name and date, like a calendar. Today is filled orange,
 * days with specials sit on a lighter cell, and empty days fade back.
 */
export function WeekTile({
    schedule,
    onOpen,
}: {
    schedule: ScheduleDay[];
    onOpen: () => void;
}) {
    const today = todayIso();

    return (
        <button
            type="button"
            onClick={onOpen}
            dir="rtl"
            className={cn(tile, 'bg-card ring-1 ring-border hover:ring-foreground/20')}
        >
            <span className="flex items-start justify-between gap-3">
                <span className="flex flex-col">
                    <span
                        dir="ltr"
                        className="self-end text-[0.6875rem] font-bold tracking-[0.16em] text-muted-foreground uppercase"
                    >
                        This week
                    </span>
                    <span className="font-display text-3xl leading-tight font-black">
                        الجدول
                    </span>
                </span>
                <Corner className="bg-muted text-foreground" />
            </span>

            <span className="flex gap-1 rounded-2xl bg-muted/70 p-1">
                {WEEK.map((isoDay) => {
                    const count =
                        schedule.find((day) => day.day === isoDay)?.products
                            .length ?? 0;
                    const current = isoDay === today;

                    return (
                        <span
                            key={isoDay}
                            className={cn(
                                'flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl',
                                current
                                    ? 'bg-brand-red text-brand-ink'
                                    : count > 0
                                      ? 'bg-card text-foreground'
                                      : 'text-muted-foreground/45',
                            )}
                        >
                            <span
                                className={cn(
                                    'max-w-full truncate px-0.5 text-[0.5625rem] leading-none font-medium',
                                    current
                                        ? 'text-brand-ink/70'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {current ? 'اليوم' : DAYS[isoDay].arabic}
                            </span>
                            <span className="font-display text-base leading-none font-bold tabular-nums">
                                {dateOf(isoDay)}
                            </span>
                        </span>
                    );
                })}
            </span>
        </button>
    );
}
