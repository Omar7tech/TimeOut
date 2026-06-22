import { CalendarDays } from 'lucide-react';
import { CategoryCard } from '@/components/menu/category-card';
import type { Category } from '@/types';

interface CategoryGridProps {
    categories: Category[];
    onSelect: (category: Category) => void;
    /** Jump to the "available today" filter. */
    onSelectToday: () => void;
}

/**
 * Responsive grid of category boxes, scaling from 3 columns on mobile up to
 * 6 on extra-large screens. A wide yellow "Today" box leads the grid as a
 * shortcut to the available-today filter.
 */
export function CategoryGrid({
    categories,
    onSelect,
    onSelectToday,
}: CategoryGridProps) {
    return (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
            <button
                type="button"
                onClick={onSelectToday}
                className="group relative col-span-2 flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-black bg-brand-yellow p-2.5 text-black shadow-[4px_4px_0_0_#000] transition-all duration-150 [background-image:radial-gradient(rgba(0,0,0,0.12)_1.5px,transparent_1.5px)] [background-size:10px_10px] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
                <CalendarDays className="size-7 transition-transform duration-150 group-hover:scale-110 sm:size-8" />
                <span className="text-center text-sm leading-tight font-black tracking-wide uppercase sm:text-base lg:text-lg">
                    Today - اليوم
                </span>
            </button>

            {categories.map((category) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}
