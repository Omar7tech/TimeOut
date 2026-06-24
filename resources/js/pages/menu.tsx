import { Head } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CartSheet } from '@/components/menu/cart-sheet';
import { CategoryAddonsDialog } from '@/components/menu/category-addons-dialog';
import { CategoryGrid } from '@/components/menu/category-grid';
import { FilterPills } from '@/components/menu/filter-pills';
import type { MenuFilter } from '@/components/menu/filter-pills';
import { OrderTypeSwitch } from '@/components/menu/order-type-switch';
import { ProductCard } from '@/components/menu/product-card';
import { SiteBanner } from '@/components/menu/site-banner';
import { SiteFooter } from '@/components/menu/site-footer';
import { SiteHeader } from '@/components/menu/site-header';
import { WeeklySchedule } from '@/components/menu/weekly-schedule';
import { WhatsAppFab } from '@/components/menu/whatsapp-fab';
import { CartProvider } from '@/contexts/cart-context';
import type { OrderType, Product, ScheduleDay } from '@/types';
import type { Category } from '@/types';

interface MenuProps {
    orderType: OrderType;
    orderTypeLabel: string;
    categories: Category[];
    showSchedule: boolean;
    schedule: ScheduleDay[] | null;
}

const TODAY_FILTER_SLUG = 'available-today-7q2x';
const SCHEDULE_FILTER_SLUG = 'weekly-schedule-3m8k';

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

    if (param === SCHEDULE_FILTER_SLUG) {
        return 'schedule';
    }

    return categories.find((category) => category.slug === param)?.id ?? null;
}

export default function Menu({
    orderType,
    orderTypeLabel,
    categories,
    showSchedule,
    schedule,
}: MenuProps) {
    // Cart/ordering is only available on the delivery (takeaway) menu.
    const cartEnabled = orderType === 'takeaway';
    const menuTitle = cartEnabled ? 'Delivery Menu' : 'Dine-In Menu';
    const [active, setActive] = useState<MenuFilter | null>(() =>
        readFilterFromUrl(categories),
    );

    // The weekly schedule renders every scheduled product card across all days,
    // which can block the click. Paint a spinner first, then mount the heavy
    // content on the next frames so the filter switch feels instant. The loading
    // flag is raised during render (when switching to the schedule) and cleared
    // from a rAF callback, so we never call setState synchronously in an effect.
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const [prevActive, setPrevActive] = useState(active);

    if (active !== prevActive) {
        setPrevActive(active);
        setScheduleLoading(active === 'schedule');
    }

    useEffect(() => {
        if (!scheduleLoading) {
            return;
        }

        let frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => setScheduleLoading(false));
        });

        return () => cancelAnimationFrame(frame);
    }, [scheduleLoading]);

    useEffect(() => {
        const url = new URL(window.location.href);

        let value: string | null = null;

        if (active === 'today') {
            value = TODAY_FILTER_SLUG;
        } else if (active === 'schedule') {
            value = SCHEDULE_FILTER_SLUG;
        } else if (typeof active === 'number') {
            value =
                categories.find((category) => category.id === active)?.slug ??
                null;
        }

        if (value === null) {
            url.searchParams.delete('filter');
        } else {
            url.searchParams.set('filter', value);
        }

        window.history.replaceState(window.history.state, '', url);
    }, [active, categories]);

    // Derive the visible products, heading and per-product add-ons for the active
    // filter. Memoized so this only recomputes when the filter or data changes,
    // not on unrelated re-renders (e.g. the schedule loading toggle).
    const { heading, products, activeCategory, addonsByProduct } = useMemo(() => {
        // Each product's add-ons come from its own category, so the mixed "today"
        // view can still surface the right extras per item.
        const byProduct = new Map<number, Category['addons']>();

        if (active === 'today') {
            const todayProducts: Product[] = [];

            for (const category of categories) {
                for (const product of category.products ?? []) {
                    if (product.available_today) {
                        todayProducts.push(product);
                        byProduct.set(product.id, category.addons);
                    }
                }
            }

            return {
                heading: 'Today - اليوم',
                products: todayProducts,
                activeCategory: null as Category | null,
                addonsByProduct: byProduct,
            };
        }

        if (typeof active === 'number') {
            const category =
                categories.find((item) => item.id === active) ?? null;
            const categoryProducts = category?.products ?? [];

            for (const product of categoryProducts) {
                byProduct.set(product.id, category?.addons ?? null);
            }

            return {
                heading: category?.title ?? '',
                products: categoryProducts,
                activeCategory: category,
                addonsByProduct: byProduct,
            };
        }

        return {
            heading: '',
            products: [] as Product[],
            activeCategory: null as Category | null,
            addonsByProduct: byProduct,
        };
    }, [active, categories]);

    return (
        <CartProvider>
            <Head title={`${orderTypeLabel} Menu`} />

            <SiteBanner />

            <SiteHeader showCart={cartEnabled} />

            <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="min-w-0 truncate text-xl font-black uppercase md:text-2xl">
                        {menuTitle}
                    </h1>

                    <OrderTypeSwitch current={orderType} />
                </div>

                {active === null ? (
                    <CategoryGrid
                        categories={categories}
                        onSelect={(category) => setActive(category.id)}
                        onSelectToday={() => setActive('today')}
                        onSelectSchedule={
                            showSchedule
                                ? () => setActive('schedule')
                                : undefined
                        }
                    />
                ) : active === 'schedule' ? (
                    <>
                        <FilterPills
                            categories={categories}
                            activeId={active}
                            onSelect={setActive}
                            showSchedule={showSchedule}
                        />

                        <div className="mt-4 flex items-center gap-3">
                            <span className="flex flex-col justify-center gap-[3px]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className="h-0.5 w-6 rounded-full bg-brand-red md:w-7"
                                    />
                                ))}
                            </span>
                            <h2 className="text-2xl font-black uppercase md:text-4xl">
                                Weekly Schedule - الجدول الأسبوعي
                            </h2>
                        </div>

                        {scheduleLoading ? (
                            <div className="flex justify-center py-16">
                                <Loader2 className="size-8 animate-spin text-brand-red" />
                            </div>
                        ) : schedule && schedule.length > 0 ? (
                            <WeeklySchedule
                                schedule={schedule}
                                enableCart={cartEnabled}
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No scheduled items.
                            </p>
                        )}
                    </>
                ) : (
                    <>
                        <FilterPills
                            categories={categories}
                            activeId={active}
                            onSelect={setActive}
                            showSchedule={showSchedule}
                        />

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <span className="flex flex-col justify-center gap-[3px]">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className="h-0.5 w-6 rounded-full bg-brand-red md:w-7"
                                        />
                                    ))}
                                </span>
                                <h2 className="text-2xl font-black uppercase md:text-4xl">
                                    {heading}
                                </h2>
                            </div>
                            <div className="flex items-center gap-3 sm:ml-auto">
                                {products.length > 0 && (
                                    <span className="text-sm font-bold text-muted-foreground">
                                        {products.length}{' '}
                                        {products.length === 1
                                            ? 'item'
                                            : 'items'}
                                    </span>
                                )}
                                {activeCategory &&
                                    activeCategory.addons &&
                                    activeCategory.addons.length > 0 && (
                                        <CategoryAddonsDialog
                                            category={activeCategory}
                                        />
                                    )}
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        addons={
                                            addonsByProduct.get(product.id) ??
                                            undefined
                                        }
                                        enableCart={cartEnabled}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No items available.
                            </p>
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

            <WhatsAppFab />
        </CartProvider>
    );
}
