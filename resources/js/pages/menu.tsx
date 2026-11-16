import { Head } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CartBar } from '@/components/menu/cart-bar';
import { CartSheet } from '@/components/menu/cart-sheet';
import { CartToast } from '@/components/menu/cart-toast';
import { CategoryAddonsDialog } from '@/components/menu/category-addons-dialog';
import { CategoryGrid } from '@/components/menu/category-grid';
import { FilterPills } from '@/components/menu/filter-pills';
import type { MenuFilter } from '@/components/menu/filter-pills';
import { MenuMasthead } from '@/components/menu/menu-masthead';
import { MenuSlider } from '@/components/menu/menu-slider';
import { ProductCard } from '@/components/menu/product-card';
import { SiteBanner } from '@/components/menu/site-banner';
import { SiteFooter } from '@/components/menu/site-footer';
import { SiteHeader } from '@/components/menu/site-header';
import { WeeklySchedule } from '@/components/menu/weekly-schedule';
import { WhatsAppFab } from '@/components/menu/whatsapp-fab';
import { CartProvider, useCart } from '@/contexts/cart-context';
import { useProductCardDesign } from '@/hooks/use-product-card-design';
import { cn, isArabic } from '@/lib/utils';
import type {
    Category,
    OrderType,
    Product,
    ProductCardDesign,
    ScheduleDay,
    Slide,
} from '@/types';

interface MenuProps {
    orderType: OrderType;
    orderTypeLabel: string;
    categories: Category[];
    slides: Slide[];
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

export default function Menu(props: MenuProps) {
    return (
        <CartProvider>
            <MenuView {...props} />
        </CartProvider>
    );
}

/** Product grid layout per card design, so each design gets the room it wants. */
const GRID: Record<ProductCardDesign, string> = {
    classic: 'grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3',
    spotlight:
        'grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:gap-5 lg:grid-cols-3',
    minimal: 'grid grid-cols-1 gap-x-12 md:grid-cols-2',
};

function MenuView({
    orderType,
    orderTypeLabel,
    categories,
    slides,
    showSchedule,
    schedule,
}: MenuProps) {
    // Cart/ordering is only available on the delivery (takeaway) menu.
    const cartEnabled = orderType === 'takeaway';
    const { count } = useCart();
    const design = useProductCardDesign();
    const [active, setActive] = useState<MenuFilter | null>(() =>
        readFilterFromUrl(categories),
    );

    // The weekly schedule renders every scheduled product card for a day,
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
    const { heading, products, activeCategory, addonsByProduct } =
        useMemo(() => {
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
                    heading: { title: 'أطباق اليوم', caption: "Today's specials" },
                    products: todayProducts,
                    activeCategory: null as Category | null,
                    addonsByProduct: byProduct,
                };
            }

            if (active === 'schedule') {
                return {
                    heading: {
                        title: 'جدول الأسبوع',
                        caption: "This week's specials",
                    },
                    products: [] as Product[],
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
                    heading: { title: category?.title ?? '', caption: null },
                    products: categoryProducts,
                    activeCategory: category,
                    addonsByProduct: byProduct,
                };
            }

            return {
                heading: { title: '', caption: null },
                products: [] as Product[],
                activeCategory: null as Category | null,
                addonsByProduct: byProduct,
            };
        }, [active, categories]);

    /** Open a view from further down the page, landing at its top. */
    const openFromBelow = (filter: MenuFilter | null): void => {
        setActive(filter);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const gridClassName = GRID[design];

    /** Each dish's section, so a dish without a photo can show its icon. */
    const categoryByProduct = useMemo(() => {
        const lookup = new Map<number, Category>();

        for (const category of categories) {
            for (const product of category.products ?? []) {
                lookup.set(product.id, category);
            }
        }

        return lookup;
    }, [categories]);

    return (
        <>
            <Head title={`${orderTypeLabel} Menu`} />

            {/* The brand's food doodles behind the header and the intro,
                fading out before the menu itself starts. */}
            {active === null && (
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-foreground opacity-[0.08] [mask-image:url('/images/doodles.webp')] [mask-size:480px] [mask-repeat:repeat]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent from-20% to-background" />
                </div>
            )}

            <SiteBanner />

            <SiteHeader showCart={cartEnabled} />

            <main
                className={cn(
                    'mx-auto flex max-w-6xl flex-col px-4 pt-2 md:px-6',
                    cartEnabled && count > 0 && 'pb-24',
                )}
            >
                {active === null ? (
                    <div className="flex flex-col gap-6 md:gap-8">
                        <MenuMasthead orderType={orderType} />

                        <MenuSlider slides={slides} enableCart={cartEnabled} />

                        <CategoryGrid
                            categories={categories}
                            onSelect={(category) => openFromBelow(category.id)}
                            onSelectToday={() => openFromBelow('today')}
                            schedule={schedule ?? []}
                            onSelectSchedule={
                                showSchedule
                                    ? () => openFromBelow('schedule')
                                    : undefined
                            }
                        />
                    </div>
                ) : (
                    <>
                        {/* The section rail rides under the header while the
                            dishes scroll past. */}
                        <div className="sticky top-16 z-20 -mx-4 bg-background/90 px-4 py-2 backdrop-blur-xl md:top-[4.5rem] md:-mx-6 md:px-6">
                            <FilterPills
                                categories={categories}
                                activeId={active}
                                onSelect={setActive}
                                onReset={() => openFromBelow(null)}
                                showSchedule={showSchedule}
                            />
                        </div>

                        <div
                            key={String(active)}
                            dir={isArabic(heading.title) ? 'rtl' : 'ltr'}
                            className="mt-6 mb-5 flex animate-rise items-end justify-between gap-4 border-b border-border pb-4 md:mt-8 md:mb-6 md:pb-5"
                        >
                            <h1 className="min-w-0 font-display text-[clamp(1.875rem,1.45rem+1.8vw,2.625rem)] leading-tight font-black">
                                {heading.title}
                            </h1>

                            {activeCategory &&
                                activeCategory.addons &&
                                activeCategory.addons.length > 0 && (
                                    <CategoryAddonsDialog
                                        category={activeCategory}
                                    />
                                )}
                        </div>

                        {active === 'schedule' ? (
                            scheduleLoading ? (
                                <div className="flex justify-center py-16">
                                    <Loader2 className="size-7 animate-spin text-brand-red" />
                                </div>
                            ) : schedule && schedule.length > 0 ? (
                                <WeeklySchedule
                                    schedule={schedule}
                                    enableCart={cartEnabled}
                                    gridClassName={gridClassName}
                                />
                            ) : (
                                <EmptyState
                                    english="No specials scheduled this week."
                                    arabic="ما في أطباق خاصة هالأسبوع."
                                />
                            )
                        ) : products.length > 0 ? (
                            <div className={gridClassName}>
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        addons={
                                            addonsByProduct.get(product.id) ??
                                            undefined
                                        }
                                        enableCart={cartEnabled}
                                        category={
                                            categoryByProduct.get(product.id) ??
                                            null
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                english={
                                    active === 'today'
                                        ? 'No specials today. Have a look at the full menu.'
                                        : 'Nothing in this section right now.'
                                }
                                arabic={
                                    active === 'today'
                                        ? 'ما في أطباق خاصة اليوم، شوف المنيو الكامل.'
                                        : 'ما في أصناف بهالقسم حالياً.'
                                }
                                onBack={() => openFromBelow(null)}
                            />
                        )}
                    </>
                )}
            </main>

            <SiteFooter
                categories={categories}
                onSelectCategory={(id) => openFromBelow(id)}
            />

            {cartEnabled && <CartBar />}
            {cartEnabled && <CartSheet />}
            {cartEnabled && <CartToast />}

            <WhatsAppFab raised={cartEnabled && count > 0} />
        </>
    );
}

/** A quiet, bilingual empty state with an optional way back to the sections. */
function EmptyState({
    english,
    arabic,
    onBack,
}: {
    english: string;
    arabic: string;
    onBack?: () => void;
}) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-[1.5rem] bg-surface px-6 py-14 text-center">
            <p className="font-display text-lg font-bold" lang="ar" dir="rtl">
                {arabic}
            </p>
            <p className="text-sm text-muted-foreground">{english}</p>
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className="mt-3 inline-flex min-h-11 items-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-[scale] duration-200 hover:scale-[1.02] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                    Open the full menu · المنيو الكامل
                </button>
            )}
        </div>
    );
}
