import { CalendarClock } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '@/components/menu/product-card';
import { cn } from '@/lib/utils';
import type { ScheduleDay } from '@/types';

interface WeeklyScheduleProps {
    schedule: ScheduleDay[];
    /** Whether today's cards can add to cart (delivery menu only). */
    enableCart?: boolean;
    /** Classes for the product grid, so it matches the menu's card design. */
    gridClassName?: string;
}

/** Day names indexed by ISO weekday (1 = Monday .. 7 = Sunday). */
const DAYS: Record<number, { arabic: string; english: string }> = {
    1: { arabic: 'الإثنين', english: 'Mon' },
    2: { arabic: 'الثلاثاء', english: 'Tue' },
    3: { arabic: 'الأربعاء', english: 'Wed' },
    4: { arabic: 'الخميس', english: 'Thu' },
    5: { arabic: 'الجمعة', english: 'Fri' },
    6: { arabic: 'السبت', english: 'Sat' },
    7: { arabic: 'الأحد', english: 'Sun' },
};

/** Today's ISO weekday (1 = Monday .. 7 = Sunday). */
function todayIso(): number {
    const day = new Date().getDay();

    return day === 0 ? 7 : day;
}

/**
 * The week's specials, one day at a time: a row of seven days (today marked in
 * red, each with how many specials it has), and under it the chosen day's
 * dishes. Today's can be ordered; another day's are there to plan a visit by,
 * so they show without the add button.
 */
export function WeeklySchedule({
    schedule,
    enableCart = false,
    gridClassName,
}: WeeklyScheduleProps) {
    const today = todayIso();
    const [day, setDay] = useState(today);
    const entry = schedule.find((item) => item.day === day);
    const products = entry?.products ?? [];
    const isToday = day === today;

    return (
        <div className="flex flex-col gap-5">
            <div
                role="tablist"
                aria-label="Day of the week"
                className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:grid md:grid-cols-7 md:px-0"
            >
                {schedule.map((item) => {
                    const selected = item.day === day;
                    const current = item.day === today;

                    return (
                        <button
                            key={item.day}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => setDay(item.day)}
                            className={cn(
                                'relative flex min-w-[4.75rem] shrink-0 flex-col items-center gap-0.5 rounded-2xl px-2 py-3 transition-[background-color,color,scale] duration-200 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                                selected
                                    ? 'bg-foreground text-background'
                                    : 'bg-muted text-foreground/80 hover:bg-raised',
                            )}
                        >
                            {current && (
                                <span
                                    aria-label="Today"
                                    className="absolute top-2 end-2 size-1.5 rounded-full bg-brand-red"
                                />
                            )}
                            <span className="text-[0.6875rem] font-semibold tracking-wider uppercase opacity-70">
                                {DAYS[item.day].english}
                            </span>
                            <span className="font-display text-sm font-bold">
                                {DAYS[item.day].arabic}
                            </span>
                            <span
                                className={cn(
                                    'mt-1 text-[0.6875rem] tabular-nums',
                                    selected
                                        ? 'text-background/70'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {item.products.length} طبق
                            </span>
                        </button>
                    );
                })}
            </div>

            {!isToday && products.length > 0 && (
                <p className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-3 text-sm text-muted-foreground">
                    <CalendarClock className="size-4 shrink-0 text-brand-red-ink" />
                    <span>
                        Served on {DAYS[day].english} only · متوفر يوم{' '}
                        {DAYS[day].arabic} فقط
                    </span>
                </p>
            )}

            {products.length > 0 ? (
                <div className={gridClassName}>
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            enableCart={isToday && enableCart}
                        />
                    ))}
                </div>
            ) : (
                <p className="rounded-2xl bg-surface px-4 py-10 text-center text-sm text-muted-foreground">
                    No specials on {DAYS[day].english} · لا يوجد أطباق خاصة يوم{' '}
                    {DAYS[day].arabic}
                </p>
            )}
        </div>
    );
}
