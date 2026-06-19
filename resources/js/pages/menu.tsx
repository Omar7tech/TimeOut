import { CategoryGrid } from '@/components/menu/category-grid';
import { FilterPills, type MenuFilter } from '@/components/menu/filter-pills';
import { ProductCard } from '@/components/menu/product-card';
import { SiteHeader } from '@/components/menu/site-header';
import { Button } from '@/components/ui/button';
import type { OrderType, Product } from '@/types';
import type { Category } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface MenuProps {
    orderType: OrderType;
    orderTypeLabel: string;
    categories: Category[];
}

export default function Menu({ orderTypeLabel, categories }: MenuProps) {
    const [active, setActive] = useState<MenuFilter | null>(null);

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

                        <h2 className="text-lg font-extrabold">{heading}</h2>

                        {products.length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
