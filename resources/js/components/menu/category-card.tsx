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
 * One section of the menu as a slab of the house orange: the name set in the
 * display face at the top corner with its dish count under it, and the
 * section's icon, big, in orange on a dark, tilted rounded-square sticker
 * stamped on the opposite corner (the icon itself stays upright). The dish
 * count sits in a small pill under the name.
 * The slab follows the language of the name, so an Arabic section reads from
 * the right with its icon on the left. On hover it lifts and the sticker
 * straightens.
 */
export function CategoryCard({ category, onSelect }: CategoryCardProps) {
    const count = category.products?.length ?? 0;
    const rtl = isArabic(category.title);

    return (
        <button
            type="button"
            onClick={() => onSelect(category)}
            dir={rtl ? 'rtl' : 'ltr'}
            className="group relative isolate flex min-h-28 flex-col overflow-hidden rounded-[1.375rem] bg-brand-red p-3.5 text-start text-brand-ink transition-[translate,scale] duration-300 ease-out hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none md:min-h-32 md:p-4"
        >
            {/* The sticker: a tilted rounded square stamped on the corner with
                the icon in it. It straightens up as the card lifts. */}
            <span
                aria-hidden
                className="absolute -end-4 -bottom-4 -z-10 grid size-24 rotate-[-14deg] place-items-center rounded-[1.75rem] bg-brand-ink text-brand-red transition-[rotate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:rotate-0 rtl:rotate-[14deg] rtl:group-hover:rotate-0 md:size-28"
            >
                <CategoryIcon
                    category={category}
                    className="size-12 -translate-x-1 -translate-y-1 rotate-[14deg] transition-[rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-0 rtl:translate-x-1 rtl:rotate-[-14deg] rtl:group-hover:rotate-0 md:size-14"
                />
            </span>

            <span className="max-w-[72%] font-display text-lg leading-tight font-black text-balance md:text-xl">
                {category.title}
            </span>
            <span className="mt-2 w-fit rounded-full bg-brand-ink/12 px-2 py-0.5 text-[0.6875rem] font-semibold">
                {rtl
                    ? `${count} ${count > 2 && count < 11 ? 'أصناف' : 'صنف'}`
                    : `${count} ${count === 1 ? 'item' : 'items'}`}
            </span>
        </button>
    );
}
