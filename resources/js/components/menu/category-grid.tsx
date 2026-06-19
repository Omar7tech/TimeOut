import { CalendarCheck } from 'lucide-react';
import { CategoryCard } from '@/components/menu/category-card';
import type { Category } from '@/types';

interface CategoryGridProps {
    categories: Category[];
    onSelect: (category: Category) => void;
    onSelectToday: () => void;
}

/** Leading yellow box that jumps to today's available items. */
function TodayCard({ onSelect }: { onSelect: () => void }) {
    const today = new Date();
    const dayEn = today.toLocaleDateString('en-US', { weekday: 'long' });
    const dayAr = today.toLocaleDateString('ar', { weekday: 'long' });

    return (
        <button
            type="button"
            onClick={onSelect}
            className="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-brand-yellow p-2 text-black shadow-[3px_3px_0_0_#000] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
            <CalendarCheck className="size-7 md:size-9" />
            <div className="text-center leading-tight">
                <p className="text-[11px] font-black uppercase leading-tight sm:text-sm">Available Today</p>
                <p dir="rtl" className="text-[11px] font-black leading-tight sm:text-sm">
                    متاح اليوم
                </p>
                <p className="mt-1 line-clamp-1 text-[10px] font-bold sm:text-xs" dir="rtl">
                    {dayEn} · {dayAr}
                </p>
            </div>
        </button>
    );
}

/**
 * Responsive grid of category boxes, scaling from 3 columns on mobile up to
 * 6 on extra-large screens, led by a yellow "Available today" box.
 */
export function CategoryGrid({ categories, onSelect, onSelectToday }: CategoryGridProps) {
    return (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
            <TodayCard onSelect={onSelectToday} />

            {categories.map((category) => (
                <CategoryCard key={category.id} category={category} onSelect={onSelect} />
            ))}
        </div>
    );
}
