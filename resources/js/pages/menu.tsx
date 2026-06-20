import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CartSheet } from '@/components/menu/cart-sheet';
import { CategoryAddonsDialog } from '@/components/menu/category-addons-dialog';
import { CategoryGrid } from '@/components/menu/category-grid';
import { FilterPills  } from '@/components/menu/filter-pills';
import type {MenuFilter} from '@/components/menu/filter-pills';
import { OrderTypeSwitch } from '@/components/menu/order-type-switch';
import { ProductCard } from '@/components/menu/product-card';
import { SiteFooter } from '@/components/menu/site-footer';
import { SiteHeader } from '@/components/menu/site-header';
import { CartProvider } from '@/contexts/cart-context';
import type { OrderType, Product } from '@/types';
import type { Category } from '@/types';

interface MenuProps {
    orderType: OrderType;
    orderTypeLabel: string;
    categories: Category[];
}

const TODAY_FILTER_SLUG = 'available-today-7q2x';

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

export default function Menu({ orderType, orderTypeLabel, categories }: MenuProps) {
    // Cart/ordering is only available on the delivery (takeaway) menu.
    const cartEnabled = orderType === 'takeaway';
    const menuTitle = cartEnabled ? 'Delivery Menu' : 'Dine-In Menu';
    const [active, setActive] = useState<MenuFilter | null>(() => readFilterFromUrl(categories));

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
    let activeCategory: Category | null = null;

    if (active === 'today') {
        heading = 'Available today';
        products = categories.flatMap((category) => category.products ?? []).filter((product) => product.available_today);
    } else if (typeof active === 'number') {
        activeCategory = categories.find((item) => item.id === active) ?? null;
        heading = activeCategory?.title ?? '';
        products = activeCategory?.products ?? [];
    }

    return (
        <CartProvider>
            <Head title={`${orderTypeLabel} Menu`} />

            <SiteHeader showCart={cartEnabled} />

            <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="min-w-0 truncate text-xl font-black uppercase md:text-2xl">{menuTitle}</h1>

                    <OrderTypeSwitch current={orderType} />
                </div>

                {active === null ? (
                    <CategoryGrid categories={categories} onSelect={(category) => setActive(category.id)} />
                ) : (
                    <>
                        <FilterPills categories={categories} activeId={active} onSelect={setActive} />

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <span className="h-7 w-1.5 rounded-full bg-brand-red md:h-9" />
                                <h2 className="text-2xl font-black uppercase md:text-4xl">{heading}</h2>
                            </div>
                            <div className="flex items-center gap-3 sm:ml-auto">
                                {products.length > 0 && (
                                    <span className="text-sm font-bold text-muted-foreground">
                                        {products.length} {products.length === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                                {activeCategory && activeCategory.addons && activeCategory.addons.length > 0 && (
                                    <CategoryAddonsDialog category={activeCategory} />
                                )}
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} enableCart={cartEnabled} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No items available.</p>
                        )}
                    </>
                )}
            </main>

            <SiteFooter
                categories={categories}
                onSelectCategory={(id) => {
                    setActive(id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />

            {cartEnabled && <CartSheet />}
        </CartProvider>
    );
}
