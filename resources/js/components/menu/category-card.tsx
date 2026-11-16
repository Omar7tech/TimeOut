import { CategoryIcon } from '@/components/menu/category-icon';
import { isArabic } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryCardProps {
    category: Category;
    /** Position in the menu (kept for callers; not printed). */
    index: number;
    onSelect: (category: Category) => void;
}

/**
 * One section of the menu as a slab of the house orange: the section's icon on
 * a light, tilted rounded-square sticker breaking off the top corner, and at
 * the foot the name set large in the display face. The slab follows the language of the name, so an Arabic section reads
 * from the right with its sticker on the left. On hover it lifts and the
 * sticker straightens.
 */
export function CategoryCard({ category, onSelect }: CategoryCardProps) {
    const rtl = isArabic(category.title);

    return (
        <button
            type="button"
            onClick={() => onSelect(category)}
            dir={rtl ? 'rtl' : 'ltr'}
            className="group relative isolate flex min-h-32 flex-col overflow-hidden rounded-[1.375rem] bg-brand-red p-3.5 text-start text-brand-ink transition-[translate,scale] duration-300 ease-out hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none md:min-h-36 md:p-4"
        >
            {/* The sticker: a tilted rounded square stamped on the corner with
                the icon in it. It straightens up as the card lifts. */}
            <span
                aria-hidden
                className="absolute -end-4 -top-4 -z-10 grid size-24 rotate-[14deg] place-items-center rounded-[1.75rem] bg-white/20 transition-[rotate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:rotate-0 rtl:rotate-[-14deg] rtl:group-hover:rotate-0 md:size-28"
            >
                <CategoryIcon
                    category={category}
                    className="size-12 -translate-x-2 translate-y-2 rotate-[-14deg] transition-[rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-0 rtl:translate-x-2 rtl:rotate-[14deg] rtl:group-hover:rotate-0 md:size-14"
                />
            </span>

            <span className="mt-auto flex max-w-[78%] flex-col gap-0.5">
                <span className="font-display text-lg leading-tight font-black text-balance md:text-xl">
                    {category.title}
                </span>
            </span>
        </button>
    );
}
