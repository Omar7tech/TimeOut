import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Bike, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { OpenCountdown } from '@/components/menu/open-countdown';
import { ShopStatus } from '@/components/menu/shop-status';
import { ThemeToggle } from '@/components/menu/theme-toggle';
import { useShopOpen } from '@/lib/shop';
import { cn } from '@/lib/utils';

/**
 * One way into the menu: a big tile with the menu's name in both languages,
 * its icon, and an arrow that slides on hover. The red tile is the main way in.
 */
function MenuLink({
    href,
    label,
    arabic,
    note,
    icon: Icon,
    primary = false,
    delay,
}: {
    href: string;
    label: string;
    arabic: string;
    note: string;
    icon: LucideIcon;
    primary?: boolean;
    delay: string;
}) {
    return (
        <Link
            href={href}
            style={{ animationDelay: delay }}
            className={cn(
                'group flex animate-rise items-center gap-4 rounded-[1.5rem] p-4 pe-5 transition-[translate,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
                primary
                    ? 'bg-brand-red text-brand-ink'
                    : 'bg-card ring-1 ring-border hover:shadow-[0_20px_40px_-18px_rgb(0_0_0/0.5)]',
            )}
        >
            <span
                className={cn(
                    'grid size-14 shrink-0 place-items-center rounded-2xl',
                    primary ? 'bg-black/20' : 'bg-muted text-brand-red-ink',
                )}
            >
                <Icon className="size-6" strokeWidth={2.2} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-baseline gap-2">
                    <span className="font-display text-xl font-extrabold">
                        {label}
                    </span>
                    <span
                        lang="ar"
                        className={cn(
                            'font-display text-lg font-bold',
                            primary ? 'text-brand-ink/70' : 'text-muted-foreground',
                        )}
                    >
                        {arabic}
                    </span>
                </span>
                <span
                    className={cn(
                        'text-sm',
                        primary ? 'text-brand-ink/70' : 'text-muted-foreground',
                    )}
                >
                    {note}
                </span>
            </span>
            <ArrowRight className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
    );
}

/**
 * The front door: the logo, the open/closed state, and the two ways into the menu. While closed, a
 * bilingual note and the countdown to opening sit under the buttons.
 */
export default function Welcome() {
    const open = useShopOpen();
    const onlineOrderingActive = usePage().props.onlineOrderingActive;

    return (
        <>
            <Head title="Time Out Snack" />

            <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
                <div className="mx-auto flex w-full max-w-md items-center justify-end gap-2 px-5 pt-5">
                    <ShopStatus />
                    <ThemeToggle />
                </div>

                <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-10 px-5 pt-6 pb-12">
                    <div className="relative grid animate-rise place-items-center py-8">
                        <h1 className="sr-only">
                            Time Out Snack · شاورما وبرغر في عاليه
                        </h1>
                        <BrandLogo alt="" className="w-full max-w-[17rem]" />
                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Shawarma, burgers & sandwiches · Aley
                            <span lang="ar" dir="rtl" className="mt-0.5 block">
                                شاورما، برغر وسندويشات · عاليه
                            </span>
                        </p>
                    </div>

                    <nav aria-label="Menus" className="flex flex-col gap-3">
                        {onlineOrderingActive && (
                            <MenuLink
                                href="/menu/delivery"
                                label="Delivery"
                                arabic="توصيل"
                                note="Order to your door on WhatsApp"
                                icon={Bike}
                                primary
                                delay="120ms"
                            />
                        )}
                        <MenuLink
                            href="/menu/dine-in"
                            label="Dine-in"
                            arabic="بالمحل"
                            note="Browse the menu at your table"
                            icon={UtensilsCrossed}
                            primary={!onlineOrderingActive}
                            delay="200ms"
                        />
                    </nav>

                    {!open && (
                        <div className="animate-rise rounded-[1.5rem] bg-surface p-5 text-center [animation-delay:280ms]">
                            <p className="text-sm font-semibold">
                                We're closed right now. Fill your cart and order
                                the moment we reopen.
                            </p>
                            <p
                                lang="ar"
                                dir="rtl"
                                className="mt-1 text-sm text-muted-foreground"
                            >
                                نحن مغلقون حالياً. املأ سلّتك واطلب فور ما نفتح.
                            </p>

                            <OpenCountdown />
                        </div>
                    )}
                </main>

                
            </div>
        </>
    );
}
