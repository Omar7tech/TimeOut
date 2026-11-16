import { useMemo } from 'react';
import { BrandSpark } from '@/components/brand-spark';
import { CategoryCard } from '@/components/menu/category-card';
import { TodayTile, WeekTile } from '@/components/menu/specials-tiles';
import type { SpecialDish } from '@/components/menu/specials-tiles';
import { cn } from '@/lib/utils';
import type { Category, ScheduleDay } from '@/types';

interface CategoryGridProps {
    categories: Category[];
    onSelect: (category: Category) => void;
    /** Jump to the "available today" filter. */
    onSelectToday: () => void;
    /** Jump to the weekly schedule view; omit to hide the schedule tile. */
    onSelectSchedule?: () => void;
    /** The week's scheduled dishes, for the schedule tile's overview. */
    schedule?: ScheduleDay[];
}

/**
 * The menu's landing view. The yellow tile lists today's specials with their
 * prices, beside a "This week" tile charting how many specials each day has
 * (when the schedule is on). Under them, every section of the menu as a
 * photographed tile, two to a row on a phone and up to four on a desk.
 */
export function CategoryGrid({
    categories,
    onSelect,
    onSelectToday,
    onSelectSchedule,
    schedule = [],
}: CategoryGridProps) {
    const showWeek = Boolean(onSelectSchedule) && schedule.length > 0;

    const specials = useMemo(() => {
        const dishes: SpecialDish[] = [];

        for (const category of categories) {
            for (const product of category.products ?? []) {
                if (product.available_today) {
                    dishes.push({ product, category });
                }
            }
        }

        return dishes;
    }, [categories]);

    return (
        <div className="flex flex-col gap-3 md:gap-4">
            <div
                dir="rtl"
                className={cn(
                    'grid gap-2.5 md:gap-3',
                    showWeek && 'md:grid-cols-[1.3fr_1fr]',
                )}
            >
                <TodayTile specials={specials} onOpen={onSelectToday} />
                {showWeek && onSelectSchedule && (
                    <WeekTile schedule={schedule} onOpen={onSelectSchedule} />
                )}
            </div>

            <div className="mt-3 flex items-center gap-3 md:mt-5">
                <BrandSpark />
                <h2 className="font-display text-xl font-extrabold md:text-2xl">
                    الأقسام{' '}
                    <span className="font-bold text-muted-foreground">
                        · Sections
                    </span>
                </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
                {categories.map((category, index) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        index={index}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </div>
    );
}
