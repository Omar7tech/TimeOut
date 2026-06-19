import { CategoryGrid } from '@/components/menu/category-grid';
import { FilterPills, type MenuFilter } from '@/components/menu/filter-pills';
import { ProductCard } from '@/components/menu/product-card';
import { SiteHeader } from '@/components/menu/site-header';
import { Button } from '@/components/ui/button';
import type { OrderType, Product } from '@/types';
import type { Category } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MenuProps {
    orderType: OrderType;
    orderTypeLabel: string;
    categories: Category[];
}

/**
 * URL token for the "available today" filter. The random suffix keeps it from
 * colliding with a real category slug.
 */
const TODAY_FILTER_SLUG = 'available-today-7q2x';

/** Read the active filter from the URL `?filter=` query (slug | today token). */
function readFilterFromUrl(categories: Category[]): MenuFilter | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const param = new URLSearchParams(window.location.search).get('filter');

    if (param === null) {
        return null;
    }

    if (param === TODAY_FILTER_SLUG) {
        return 'today';
    }

    return categories.find((category) => category.slug === param)?.id ?? null;
}

export default function Menu({ orderTypeLabel, categories }: MenuProps) {
    const [active, setActive] = useState<MenuFilter | null>(() => readFilterFromUrl(categories));

    // Keep the URL in sync so a refresh restores the current filter (no request).
    useEffect(() => {
        const url = new URL(window.location.href);

        let value: string | null = null;

        if (active === 'today') {
            value = TODAY_FILTER_SLUG;
        } else if (typeof active === 'number') {
            value = categories.find((category) => category.id === active)?.slug ?? null;
        }

        if (value === null) {
            url.searchParams.delete('filter');
        } else {
            url.searchParams.set('filter', value);
        }

        window.history.replaceState(window.history.state, '', url);
    }, [active, categories]);

    let heading = '';
    let products: Product[] = [];

    if (active === 'today') {
        heading = 'Available today';
        products = categories.flatMap((category) => category.products ?? []).filter((product) => product.available_today);
    } else if (typeof active === 'number') {
        const category = categories.find((item) => item.id === active);
        heading = category?.title ?? '';
        products = category?.products ?? [];
    }

    return (
        <>
            <Head title={`${orderTypeLabel} Menu`} />

            <SiteHeader />

            <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6">
                {active === null ? (
                    <CategoryGrid categories={categories} onSelect={(category) => setActive(category.id)} />
                ) : (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-2 w-fit gap-1 text-muted-foreground"
                            onClick={() => setActive(null)}
                        >
                            <ChevronLeft className="size-4" />
                            All categories
                        </Button>

                        <FilterPills categories={categories} activeId={active} onSelect={setActive} />

                        <div className="mt-4 flex items-center gap-3">
                            <span className="h-7 w-1.5 rounded-full bg-brand-red md:h-9" />
                            <h2 className="text-2xl font-black uppercase md:text-4xl">{heading}</h2>
                            {products.length > 0 && (
                                <span className="ml-auto text-sm font-bold text-muted-foreground">
                                    {products.length} {products.length === 1 ? 'item' : 'items'}
                                </span>
                            )}
                        </div>

                        {products.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No items available.</p>
                        )}
                    </>
                )}
            </main>
        </>
    );
}
