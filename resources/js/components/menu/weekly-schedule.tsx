import { CalendarDays } from 'lucide-react';
import { ProductCard } from '@/components/menu/product-card';
import { cn } from '@/lib/utils';
import type { ScheduleDay } from '@/types';

interface WeeklyScheduleProps {
    schedule: ScheduleDay[];
    /** Whether today's cards can add to cart (delivery menu only). */
    enableCart?: boolean;
}

/** Day labels indexed by ISO weekday (1 = Monday .. 7 = Sunday). */
const DAY_LABELS: Record<number, string> = {
    1: 'Monday - الإثنين',
    2: 'Tuesday - الثلاثاء',
    3: 'Wednesday - الأربعاء',
    4: 'Thursday - الخميس',
    5: 'Friday - الجمعة',
    6: 'Saturday - السبت',
    7: 'Sunday - الأحد',
};

/** Today's ISO weekday (1 = Monday .. 7 = Sunday). */
function todayIso(): number {
    const day = new Date().getDay();

    return day === 0 ? 7 : day;
}

/**
 * Weekly product schedule: one section per weekday listing the scheduled items
 * available that day, with today highlighted so customers can plan their visit.
 * The items render as the regular product cards but muted, since this view is
 * for browsing the schedule rather than ordering.
 */
export function WeeklySchedule({
    schedule,
    enableCart = false,
}: WeeklyScheduleProps) {
    const today = todayIso();

    return (
        <div className="flex flex-col gap-4">
            {schedule.map((entry) => {
                const isToday = entry.day === today;

                return (
                    <section
                        key={entry.day}
                        className={cn(
                            'rounded-lg border-2 p-3 shadow-[4px_4px_0_0_#000]',
                            isToday
                                ? 'border-black bg-brand-red'
                                : 'border-neutral-700 bg-card',
                        )}
                    >
                        <div className="mb-3 flex items-center gap-2">
                            <CalendarDays
                                className={cn(
                                    'size-5',
                                    isToday
                                        ? 'text-white'
                                        : 'text-muted-foreground',
                                )}
                            />
                            <h3
                                className={cn(
                                    'text-base font-black tracking-wide uppercase md:text-lg',
                                    isToday && 'text-white',
                                )}
                            >
                                {DAY_LABELS[entry.day]}
                            </h3>
                            {isToday && (
                                <span className="rounded-full border-2 border-black bg-white px-2 py-0.5 text-[10px] font-extrabold tracking-widest text-brand-red uppercase">
                                    Today
                                </span>
                            )}
                        </div>

                        {entry.products.length > 0 ? (
                            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {entry.products.map((product) => (
                                    <div
                                        key={product.id}
                                        // Today's items are available now (normal, interactive);
                                        // other days are the same card, just disabled.
                                        className={cn(
                                            'h-full *:h-full',
                                            !isToday &&
                                                'pointer-events-none opacity-50',
                                        )}
                                        aria-hidden={!isToday}
                                    >
                                        <ProductCard
                                            product={product}
                                            enableCart={isToday && enableCart}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p
                                className={cn(
                                    'text-sm font-semibold',
                                    isToday
                                        ? 'text-white/80'
                                        : 'text-muted-foreground',
                                )}
                            >
                                No scheduled items - لا يوجد منتجات مجدولة
                            </p>
                        )}
                    </section>
                );
            })}
        </div>
    );
}
