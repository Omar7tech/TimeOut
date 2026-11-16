import { ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';
import { BrandSpark } from '@/components/brand-spark';
import { CategoryCard } from '@/components/menu/category-card';
import { SmartImage } from '@/components/smart-image';
import { cn } from '@/lib/utils';
import type { Category, Product } from '@/types';

interface CategoryGridProps {
    categories: Category[];
    onSelect: (category: Category) => void;
    /** Jump to the "available today" filter. */
    onSelectToday: () => void;
    /** Jump to the weekly schedule view; omit to hide the schedule tile. */
    onSelectSchedule?: () => void;
}

/** Short weekday initials, Monday first, for the schedule tile's week row. */
const WEEK = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];

/** Today's ISO weekday (1 = Monday .. 7 = Sunday). */
function todayIso(): number {
    const day = new Date().getDay();

    return day === 0 ? 7 : day;
}

/**
 * The menu's landing view. A yellow "Today" tile leads, carrying the logo's
 * sunburst and a peek at what's on today, beside a quieter "This week" tile
 * when the schedule is on. Under them, every section of the menu as a
 * photographed tile, two to a row on a phone and up to four on a desk.
 */
export function CategoryGrid({
    categories,
    onSelect,
    onSelectToday,
    onSelectSchedule,
}: CategoryGridProps) {
    const hasSchedule = Boolean(onSelectSchedule);

    const todayProducts = useMemo(() => {
        const products: Product[] = [];

        for (const category of categories) {
            for (const product of category.products ?? []) {
                if (product.available_today) {
                    products.push(product);
                }
            }
        }

        return products;
    }, [categories]);

    const peek = todayProducts
        .filter((product) => product.thumb ?? product.image)
        .slice(0, 3);
    const today = todayIso();

    return (
        <div className="flex flex-col gap-3 md:gap-4">
            <div
                className={cn(
                    'grid gap-3 md:gap-4',
                    hasSchedule && 'sm:grid-cols-[1.4fr_1fr]',
                )}
            >
                <button
                    type="button"
                    onClick={onSelectToday}
                    className="group relative isolate flex min-h-36 flex-col justify-between overflow-hidden rounded-[1.5rem] bg-brand-yellow p-5 text-start text-black transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgb(247_226_28/0.6)] active:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none md:min-h-44 md:p-6"
                >
                    <span
                        aria-hidden
                        className="sunburst absolute -top-28 -right-28 -z-10 size-80 opacity-[0.14] transition-transform duration-700 ease-out [--ray:#000] group-hover:rotate-12"
                    />

                    <span className="flex items-start justify-between gap-3">
                        <span className="flex flex-col">
                            <span className="text-xs font-bold tracking-[0.18em] uppercase">
                                Today's specials
                            </span>
                            <span
                                lang="ar"
                                className="font-display text-4xl leading-tight font-black md:text-5xl"
                            >
                                اليوم
                            </span>
                        </span>
                        <span
                            aria-hidden
                            className="grid size-11 shrink-0 place-items-center rounded-full bg-black text-brand-yellow transition-[rotate] duration-300 group-hover:rotate-45"
                        >
                            <ArrowUpRight className="size-5" strokeWidth={2.4} />
                        </span>
                    </span>

                    <span className="mt-4 flex items-center gap-3">
                        {peek.length > 0 && (
                            <span className="flex -space-x-3 rtl:space-x-reverse">
                                {peek.map((product) => (
                                    <SmartImage
                                        key={product.id}
                                        src={product.thumb ?? product.image ?? ''}
                                        alt=""
                                        className="size-10 rounded-full ring-[3px] ring-brand-yellow"
                                        imgClassName="object-cover"
                                        draggable={false}
                                    />
                                ))}
                            </span>
                        )}
                        <span className="text-sm font-semibold">
                            <span className="font-display font-black tabular-nums">
                                {todayProducts.length}
                            </span>{' '}
                            {todayProducts.length === 1 ? 'special' : 'specials'}{' '}
                            on today · أطباق اليوم
                        </span>
                    </span>
                </button>

                {hasSchedule && (
                    <button
                        type="button"
                        onClick={onSelectSchedule}
                        className="group flex min-h-36 flex-col justify-between rounded-[1.5rem] bg-card p-5 text-start ring-1 ring-border transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgb(0_0_0/0.45)] active:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:min-h-44 md:p-6"
                    >
                        <span className="flex items-start justify-between gap-3">
                            <span className="flex flex-col">
                                <span className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
                                    This week
                                </span>
                                <span
                                    lang="ar"
                                    className="font-display text-3xl leading-tight font-black md:text-4xl"
                                >
                                    الجدول
                                </span>
                            </span>
                            <span
                                aria-hidden
                                className="grid size-11 shrink-0 place-items-center rounded-full bg-muted transition-[background-color,color,rotate] duration-300 group-hover:rotate-45 group-hover:bg-brand-red group-hover:text-brand-ink"
                            >
                                <ArrowUpRight className="size-5" strokeWidth={2.4} />
                            </span>
                        </span>

                        <span
                            aria-hidden
                            dir="rtl"
                            className="mt-4 grid grid-cols-7 gap-1.5"
                        >
                            {WEEK.map((initial, index) => (
                                <span
                                    key={initial}
                                    className={cn(
                                        'grid aspect-square place-items-center rounded-full text-xs font-bold',
                                        index + 1 === today
                                            ? 'bg-brand-red text-brand-ink'
                                            : 'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {initial}
                                </span>
                            ))}
                        </span>
                    </button>
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
