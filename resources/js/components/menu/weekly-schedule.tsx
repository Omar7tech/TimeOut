import { CalendarClock } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '@/components/menu/product-card';
import {
    DAYS,
    ScheduleDayPicker,
    todayIso,
} from '@/components/menu/schedule-day-picker';
import type { ScheduleDay } from '@/types';

interface WeeklyScheduleProps {
    schedule: ScheduleDay[];
    /** Whether today's cards can add to cart (delivery menu only). */
    enableCart?: boolean;
    /** Classes for the product grid, so it matches the menu's card design. */
    gridClassName?: string;
}

/**
 * The week's specials, one day at a time: the day picker (in the design chosen
 * from the dashboard), and under it the chosen day's dishes. Today's can be ordered; another day's are there to plan a visit by,
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
            <ScheduleDayPicker
                schedule={schedule}
                day={day}
                onSelect={setDay}
            />

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
