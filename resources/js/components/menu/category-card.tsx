import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryIcon } from '@/components/menu/category-icon';
import { useCategoryCardDesign } from '@/hooks/use-category-card-design';
import { cn, isArabic } from '@/lib/utils';
import type { Category, CategoryCardDesign } from '@/types';

interface CategoryCardProps {
    category: Category;
    /** Position in the menu (kept for callers; not printed). */
    index: number;
    onSelect: (category: Category) => void;
}

/** The grid each section card design lays out best in. */
export const CATEGORY_GRID: Record<CategoryCardDesign, string> = {
    slab: 'grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-5',
    tile: 'grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:gap-3 lg:grid-cols-5',
    list: 'grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-2.5',
    bubbles:
        'grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8',
};

const focus =
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none';

/**
 * One section of the menu, in the design chosen in the dashboard: an orange
 * slab with a tilted sticker (default), a calm centred tile, a compact row, or
 * a round bubble. They share one behaviour and all follow the language of the
 * section's name.
 */
export function CategoryCard(props: CategoryCardProps) {
    const design = useCategoryCardDesign();

    if (design === 'tile') {
        return <TileCard {...props} />;
    }

    if (design === 'list') {
        return <ListCard {...props} />;
    }

    if (design === 'bubbles') {
        return <BubbleCard {...props} />;
    }

    return <SlabCard {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Design 1 — Slab (default)                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A slab of the house orange: the section's icon on a light, tilted
 * rounded-square sticker breaking off the top corner, and the name set large
 * at the foot. On hover it lifts and the sticker straightens.
 */
function SlabCard({ category, onSelect }: CategoryCardProps) {
    const rtl = isArabic(category.title);

    return (
        <button
            type="button"
            onClick={() => onSelect(category)}
            dir={rtl ? 'rtl' : 'ltr'}
            className={cn(
                'group relative isolate flex min-h-32 flex-col overflow-hidden rounded-[1.375rem] bg-brand-red p-3.5 text-start text-brand-ink transition-[translate,scale] duration-300 ease-out hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] md:min-h-36 md:p-4',
                focus,
            )}
        >
            <span
                aria-hidden
                className="absolute -end-4 -top-4 -z-10 grid size-28 rotate-[14deg] place-items-center rounded-[1.75rem] bg-white/20 transition-[rotate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:rotate-0 rtl:rotate-[-14deg] rtl:group-hover:rotate-0 md:size-32"
            >
                <CategoryIcon
                    category={category}
                    className="size-14 -translate-x-2.5 translate-y-2.5 rotate-[-14deg] transition-[rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-0 rtl:translate-x-2.5 rtl:rotate-[14deg] rtl:group-hover:rotate-0 md:size-16"
                />
            </span>

            <span className="mt-auto max-w-[78%] font-display text-lg leading-tight font-black text-balance md:text-xl">
                {category.title}
            </span>
        </button>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 2 — Tile                                                            */
/* -------------------------------------------------------------------------- */

/**
 * A calm card on the page's card colour: the icon centred in a soft orange
 * circle that fills solid on hover, the name centred under it.
 */
function TileCard({ category, onSelect }: CategoryCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(category)}
            className={cn(
                'group flex flex-col items-center gap-2.5 rounded-[1.25rem] bg-card px-2 pt-4 pb-3.5 text-center ring-1 ring-border transition-[translate,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:ring-brand-red/40 active:translate-y-0 md:pt-5 md:pb-4',
                focus,
            )}
        >
            <span className="grid size-16 place-items-center rounded-full bg-brand-red/12 text-brand-red-ink transition-[background-color,color,scale] duration-300 ease-out group-hover:scale-105 group-hover:bg-brand-red group-hover:text-brand-ink md:size-[4.5rem]">
                <CategoryIcon category={category} className="size-8 md:size-9" />
            </span>
            <span
                dir="auto"
                className="line-clamp-2 font-display text-sm leading-snug font-bold md:text-base"
            >
                {category.title}
            </span>
        </button>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 3 — List                                                            */
/* -------------------------------------------------------------------------- */

/**
 * A compact row: the icon on an orange plate at the start, the name, and an
 * arrow at the end. One under the other on a phone, two columns on a desk.
 */
function ListCard({ category, onSelect }: CategoryCardProps) {
    const rtl = isArabic(category.title);
    const Arrow = rtl ? ChevronLeft : ChevronRight;

    return (
        <button
            type="button"
            onClick={() => onSelect(category)}
            dir={rtl ? 'rtl' : 'ltr'}
            className={cn(
                'group flex min-h-16 items-center gap-3.5 rounded-2xl bg-card p-2 pe-4 text-start ring-1 ring-border transition-[background-color,box-shadow] duration-200 hover:bg-raised hover:ring-brand-red/40',
                focus,
            )}
        >
            <span className="grid size-12 shrink-0 rotate-[-6deg] place-items-center rounded-xl bg-brand-red text-brand-ink transition-[rotate] duration-300 group-hover:rotate-0 rtl:rotate-[6deg] rtl:group-hover:rotate-0">
                <CategoryIcon category={category} className="size-7" />
            </span>
            <span className="min-w-0 flex-1 truncate font-display text-base font-bold md:text-lg">
                {category.title}
            </span>
            <Arrow className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </button>
    );
}

/* -------------------------------------------------------------------------- */
/* Design 4 — Bubbles                                                         */
/* -------------------------------------------------------------------------- */

/**
 * A round orange bubble with the icon, and the name under it, like a row of
 * stories. The smallest design: the whole menu fits on one screen.
 */
function BubbleCard({ category, onSelect }: CategoryCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(category)}
            className={cn(
                'group flex flex-col items-center gap-2 rounded-2xl text-center',
                focus,
            )}
        >
            <span className="grid aspect-square w-full max-w-[4.75rem] place-items-center rounded-full bg-brand-red text-brand-ink ring-2 ring-brand-red ring-offset-[3px] ring-offset-background transition-[scale,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-active:scale-95">
                <CategoryIcon category={category} className="size-[45%]" />
            </span>
            <span
                dir="auto"
                className="line-clamp-2 font-display text-xs leading-snug font-bold md:text-sm"
            >
                {category.title}
            </span>
        </button>
    );
}
