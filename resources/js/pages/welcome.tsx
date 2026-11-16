import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Bike, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AnimatedLogo } from '@/components/animated-logo';
import { OpenCountdown } from '@/components/menu/open-countdown';
import { ThemeToggle } from '@/components/menu/theme-toggle';
import { useShopOpen } from '@/lib/shop';
import { cn } from '@/lib/utils';

/**
 * One way into the menu: a tilted icon plate and a round arrow across the top,
 * so it reads as something to tap, and the Arabic name large at the foot with
 * the English and a short note around it. The main way in is the solid orange
 * slab; the other sits on the card colour with orange accents.
 */
function MenuTile({
    href,
    arabic,
    english,
    note,
    icon: Icon,
    primary,
    delay,
    className,
}: {
    href: string;
    arabic: string;
    english: string;
    note: string;
    icon: LucideIcon;
    primary: boolean;
    delay: number;
    className?: string;
}) {
    return (
        <Link
            href={href}
            dir="rtl"
            style={{ animationDelay: `${delay}ms` }}
            className={cn(
                'group relative isolate flex min-h-44 animate-rise flex-col justify-between gap-6 overflow-hidden rounded-[1.5rem] p-4 text-start transition-[translate,scale] duration-300 ease-out hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
                primary
                    ? 'bg-brand-red text-brand-ink'
                    : 'bg-card text-foreground ring-1 ring-border',
                className,
            )}
        >
            <span className="flex items-start justify-between">
                <span
                    aria-hidden
                    className={cn(
                        'grid size-12 rotate-[8deg] place-items-center rounded-2xl transition-[rotate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:rotate-0',
                        primary
                            ? 'bg-white/25 text-brand-ink'
                            : 'bg-brand-red/15 text-brand-red-ink',
                    )}
                >
                    <Icon className="size-6" strokeWidth={2.2} />
                </span>
                <span
                    aria-hidden
                    className={cn(
                        'grid size-9 place-items-center rounded-full transition-transform duration-300 ease-out group-hover:-translate-x-1',
                        primary
                            ? 'bg-brand-ink text-brand-red'
                            : 'bg-foreground text-background',
                    )}
                >
                    <ArrowLeft className="size-4" strokeWidth={2.6} />
                </span>
            </span>

            <span className="flex flex-col gap-0.5">
                <span
                    dir="ltr"
                    className={cn(
                        'self-end text-[0.6875rem] font-bold tracking-[0.16em] uppercase',
                        primary ? 'text-brand-ink/60' : 'text-muted-foreground',
                    )}
                >
                    {english}
                </span>
                <span className="font-display text-3xl leading-tight font-black">
                    {arabic}
                </span>
                <span
                    className={cn(
                        'mt-0.5 text-xs font-medium',
                        primary ? 'text-brand-ink/70' : 'text-muted-foreground',
                    )}
                >
                    {note}
                </span>
            </span>
        </Link>
    );
}

/**
 * The front door: the logo drawing itself in over the shop's food-doodle
 * pattern, a one-line promise in both languages, and the two ways into the
 * menu. While closed, a "closed" stamp lands on the logo and the countdown to
 * opening sits under the tiles.
 */
export default function Welcome() {
    const open = useShopOpen();
    const { onlineOrderingActive, socials } = usePage().props;

    return (
        <>
            <Head title="Time Out Snack" />

            <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
                {/* The brand's food doodles, painted in the page's ink and
                    faded out behind the logo so it stays clean. */}
                <div
                    aria-hidden
                    className="absolute inset-0 -z-20 bg-foreground opacity-[0.07] [mask-image:url('/images/doodles.webp')] [mask-size:560px] [mask-repeat:repeat]"
                />
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_45%_at_50%_32%,var(--background)_30%,transparent_100%)]"
                />

                <header className="mx-auto flex w-full max-w-md items-center justify-end px-5 pt-5">
                    <ThemeToggle />
                </header>

                <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-9 px-5 pb-10">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative w-full max-w-[22rem]">
                            <AnimatedLogo />
                            {!open && (
                                <span className="logo-stamp absolute -bottom-3 left-1/2 -ml-16 rounded-xl border-[3px] border-brand-red bg-background/90 px-3 py-1 font-display text-lg font-black tracking-wide text-brand-red-ink uppercase">
                                    Closed · مغلق
                                </span>
                            )}
                        </div>

                        <p
                            className="flex animate-rise flex-col items-center gap-1 text-center"
                            style={{ animationDelay: '550ms' }}
                        >
                            <span
                                lang="ar"
                                dir="rtl"
                                className="font-display text-xl font-bold"
                            >
                                <span className="text-brand-red-ink">عنجد</span>{' '}
                                تايم آوت سناك
                            </span>
                            <span className="text-sm text-muted-foreground">
                                For real, Time Out Snack · Aley
                            </span>
                        </p>
                    </div>

                    <nav
                        aria-label="Menus"
                        dir="rtl"
                        className={cn(
                            'grid gap-3',
                            onlineOrderingActive && 'grid-cols-2',
                        )}
                    >
                        {onlineOrderingActive && (
                            <MenuTile
                                href="/menu/delivery"
                                arabic="توصيل"
                                english="Delivery"
                                note="اطلب عالواتساب"
                                icon={Bike}
                                primary
                                delay={620}
                            />
                        )}
                        <MenuTile
                            href="/menu/dine-in"
                            arabic="بالمحل"
                            english="Dine-in"
                            note="تصفّح المنيو"
                            icon={UtensilsCrossed}
                            primary={!onlineOrderingActive}
                            delay={680}
                        />
                    </nav>

                    {!open && (
                        <div
                            className="animate-rise rounded-[1.5rem] bg-surface p-5 text-center"
                            style={{ animationDelay: '740ms' }}
                        >
                            <p lang="ar" dir="rtl" className="text-sm font-semibold">
                                مغلقين هلق. عبّي سلتك واطلب أول ما نفتح.
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                We're closed right now. Fill your cart and order
                                the moment we reopen.
                            </p>

                            <OpenCountdown />
                        </div>
                    )}
                </main>

                <footer
                    className="mx-auto flex w-full max-w-md animate-rise flex-col items-center gap-3 px-5 pb-6"
                    style={{ animationDelay: '780ms' }}
                >
                    {socials.length > 0 && (
                        <ul className="flex items-center gap-2">
                            {socials.map((social) => (
                                <li key={social.platform}>
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={social.label}
                                        className="grid size-11 place-items-center rounded-full bg-card ring-1 ring-border transition-[translate,background-color] duration-200 hover:-translate-y-0.5 hover:bg-raised focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    >
                                        <img
                                            src={social.icon}
                                            alt=""
                                            className="size-5"
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Aley, Lebanon · عاليه، لبنان
                    </p>
                </footer>
            </div>
        </>
    );
}
