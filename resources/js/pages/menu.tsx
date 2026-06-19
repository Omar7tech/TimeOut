import { CategoryGrid } from '@/components/menu/category-grid';
import { FilterPills } from '@/components/menu/filter-pills';
import { ProductCard } from '@/components/menu/product-card';
import { SiteHeader } from '@/components/menu/site-header';
import { Button } from '@/components/ui/button';
import type { Category, OrderType } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface MenuProps {
    orderType: OrderType;
    orderTypeLabel: string;
    categories: Category[];
}

export default function Menu({ orderTypeLabel, categories }: MenuProps) {
    const [activeId, setActiveId] = useState<number | null>(null);

    const activeCategory = categories.find((category) => category.id === activeId) ?? null;

    return (
        <>
            <Head title={`${orderTypeLabel} Menu`} />

            <SiteHeader />

            <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6">
                {activeCategory === null ? (
                    <CategoryGrid categories={categories} onSelect={(category) => setActiveId(category.id)} />
                ) : (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-2 w-fit gap-1 text-muted-foreground"
                            onClick={() => setActiveId(null)}
                        >
                            <ChevronLeft className="size-4" />
                            All categories
                        </Button>

                        <FilterPills categories={categories} activeId={activeCategory.id} onSelect={setActiveId} />

                        {(activeCategory.products ?? []).length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {(activeCategory.products ?? []).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No items available in this category.</p>
                        )}
                    </>
                )}
            </main>
        </>
    );
}
