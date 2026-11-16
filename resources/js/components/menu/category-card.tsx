import { CategoryIcon } from '@/components/menu/category-icon';
import { cn, isArabic } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryCardProps {
    category: Category;
    /** Position in the menu; every fifth tile, starting with the first, is lit orange. */
    index: number;
    onSelect: (category: Category) => void;
}

/**
 * One section of the menu as a small poster: the name set huge in the display
 * face at the foot, the section's icon on a plate up top, and the same icon
 * again as a giant watermark breaking off the corner. Every fifth tile is lit
 * in the house orange so the grid has a beat. On hover the watermark swings
 * upright and warms, and the plate lifts.
 */
export function CategoryCard({ category, index, onSelect }: CategoryCardProps) {
    const count = category.products?.length ?? 0;
    const rtl = isArabic(category.title);
    const lit = index % 5 === 0;

    return (
        <button
            type="button"
            onClick={() => onSelect(category)}
            dir={rtl ? 'rtl' : 'ltr'}
            className={cn(
                'group relative isolate flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[1.5rem] p-4 text-start transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none md:p-5',
                lit
                    ? 'bg-brand-red text-brand-ink hover:shadow-[0_22px_44px_-20px_rgb(255_102_0/0.8)]'
                    : 'bg-card text-foreground ring-1 ring-border hover:shadow-[0_22px_44px_-22px_rgb(0_0_0/0.6)] hover:ring-brand-red/50',
            )}
        >
            {/* The watermark: the icon again, huge, breaking off the corner. */}
            <CategoryIcon
                category={category}
                className={cn(
                    'absolute -end-[22%] -top-[12%] -z-10 size-[78%] rotate-[-14deg] transition-[rotate,color,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:rotate-0',
                    lit
                        ? 'text-brand-ink/12'
                        : 'text-foreground/[0.05] group-hover:text-brand-red/15',
                )}
            />

            <span className="flex items-center gap-2.5">
                <span
                    className={cn(
                        'grid size-11 place-items-center rounded-full transition-transform duration-300 ease-out group-hover:-translate-y-0.5',
                        lit
                            ? 'bg-brand-ink text-brand-red'
                            : 'bg-brand-red text-brand-ink',
                    )}
                >
                    <CategoryIcon category={category} className="size-6" />
                </span>
                <span
                    className={cn(
                        'text-xs font-semibold tabular-nums',
                        lit ? 'text-brand-ink/70' : 'text-muted-foreground',
                    )}
                >
                    {rtl
                        ? `${count} ${count > 2 && count < 11 ? 'أصناف' : 'صنف'}`
                        : `${count} ${count === 1 ? 'item' : 'items'}`}
                </span>
            </span>

            <span className="font-display text-[clamp(1.375rem,1rem+1.6vw,2rem)] leading-[1.15] font-black text-balance">
                {category.title}
            </span>
        </button>
    );
}
