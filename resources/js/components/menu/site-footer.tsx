import { usePage } from '@inertiajs/react';
import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AnimatedLogo } from '@/components/animated-logo';
import { FooterHours } from '@/components/menu/footer-hours';
import { useShop } from '@/lib/shop';
import { cn } from '@/lib/utils';
import { buildWhatsAppUrl } from '@/lib/whatsapp-order';
import type { Category } from '@/types';

/** The shop on Google Maps, the same link as the structured data. */
const MAPS_URL = 'https://maps.app.goo.gl/oqgUfzQC5yu9EVso6';

interface SiteFooterProps {
    categories: Category[];
    /** Jump to a section of the menu above (same client-side filter as the pills). */
    onSelectCategory?: (id: number) => void;
}

/**
 * Whether the element has scrolled into view yet. Fires once and stays true,
 * so whatever it starts plays a single time.
 */
function useSeen<T extends Element>(): [React.RefObject<T | null>, boolean] {
    const ref = useRef<T>(null);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        const el = ref.current;

        if (!el || seen) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSeen(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [seen]);

    return [ref, seen];
}

/** A small heading over a footer column. */
function Label({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="mb-3 text-xs font-semibold tracking-[0.14em] text-muted-foreground">
            {children}
        </h2>
    );
}

/**
 * The close of every menu page, in the page's own theme: an orange "Hungry?"
 * card with the two things a customer wants next (order on WhatsApp, get
 * directions), one tidy panel with the sections, hours and socials, and the
 * logo set large and whole at the foot, drawing itself in once when it
 * scrolls into view. The brand's food doodles sit faintly behind it all.
 */
export function SiteFooter({ categories, onSelectCategory }: SiteFooterProps) {
    const { socials, whatsappNumber, whatsappBadge } = usePage().props;
    const chatNumber = whatsappNumber ?? whatsappBadge.number;
    const showHours = useShop().statusMode === 'automatic';
    const [logoRef, logoSeen] = useSeen<HTMLDivElement>();

    return (
        <footer className="relative isolate mt-20 overflow-hidden border-t border-border bg-surface">
            <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-foreground opacity-[0.045] [mask-image:url('/images/doodles.webp')] [mask-size:560px] [mask-repeat:repeat]"
            />

            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-10 md:gap-5 md:px-6 md:pt-14">
                {/* Hungry? The one thing to do next, in the house orange. */}
                <section
                    dir="rtl"
                    className="relative isolate grid gap-6 overflow-hidden rounded-[1.75rem] bg-brand-red p-6 text-brand-ink md:grid-cols-[1fr_auto] md:items-center md:p-8"
                >
                    <span
                        aria-hidden
                        className="absolute -top-12 -left-10 -z-10 size-44 rotate-[-14deg] rounded-[2.75rem] bg-white/15"
                    />

                    <div>
                        <p className="font-display text-4xl leading-none font-black md:text-5xl">
                            جوعان؟
                        </p>
                        <p className="mt-2 text-sm font-medium text-brand-ink/70">
                            نحنا بعاليه، والأكل سخن عالطلب.
                            <span dir="ltr" className="block">
                                Hungry? We're right here in Aley.
                            </span>
                        </p>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2 md:flex md:flex-col">
                        {chatNumber && (
                            <a
                                href={buildWhatsAppUrl(
                                    chatNumber,
                                    'مرحبا Time Out',
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl bg-brand-ink px-5 font-display text-sm font-bold text-[#f8f1e7] transition-[scale] duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-2 focus-visible:ring-offset-brand-red focus-visible:outline-none"
                            >
                                <img
                                    src="/social-icons/whatsapp.svg"
                                    alt=""
                                    className="size-5"
                                />
                                راسلنا عالواتساب
                            </a>
                        )}
                        <a
                            href={MAPS_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl bg-white/20 px-5 font-display text-sm font-bold transition-[background-color,scale] duration-200 hover:bg-white/30 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:outline-none"
                        >
                            <MapPin className="size-5" strokeWidth={2.2} />
                            موقعنا على الخريطة
                        </a>
                    </div>
                </section>

                {/* Sections, hours, socials, on one panel. */}
                <div
                    dir="rtl"
                    className={cn(
                        'grid divide-y divide-border rounded-[1.75rem] bg-card ring-1 ring-border md:divide-x md:divide-y-0 md:divide-x-reverse',
                        showHours
                            ? 'md:grid-cols-[1.5fr_1fr_auto]'
                            : 'md:grid-cols-[1fr_auto]',
                    )}
                >
                    <nav aria-label="Menu sections" className="p-6 md:p-7">
                        <Label>الأقسام · Sections</Label>
                        <ul className="grid grid-cols-2 gap-x-6 md:grid-cols-3">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSelectCategory?.(category.id)
                                        }
                                        dir="auto"
                                        className="group inline-flex min-h-10 items-center gap-2 rounded-md font-display text-[0.9375rem] font-bold text-foreground/70 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    >
                                        <span
                                            aria-hidden
                                            className="h-0.5 w-0 rounded-full bg-brand-red transition-[width] duration-300 group-hover:w-3"
                                        />
                                        {category.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {showHours && (
                        <div dir="ltr" className="p-6 md:p-7">
                            <FooterHours />
                        </div>
                    )}

                    {socials.length > 0 && (
                        <div className="p-6 md:p-7">
                            <Label>تابعنا · Follow</Label>
                            <ul className="flex flex-wrap gap-2">
                                {socials.map((social) => (
                                    <li key={social.platform}>
                                        <a
                                            href={social.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={social.label}
                                            title={social.label}
                                            className="grid size-12 place-items-center rounded-2xl bg-muted transition-[translate,background-color] duration-200 hover:-translate-y-0.5 hover:bg-raised focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
                        </div>
                    )}
                </div>

                {/* The signature: the logo, large and whole, drawing itself in
                    when it comes into view. */}
                <div
                    ref={logoRef}
                    className={cn(
                        'mx-auto w-full max-w-xl px-2 pt-10 pb-8 transition-opacity duration-300 md:pt-14 md:pb-10',
                        logoSeen ? 'opacity-100' : 'opacity-0',
                    )}
                >
                    <AnimatedLogo animate={logoSeen} title="" />
                </div>
            </div>

            <div className="border-t border-border">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-1 px-4 py-5 text-xs text-muted-foreground sm:flex-row md:px-6">
                    <span>© {new Date().getFullYear()} Time Out Snack</span>
                    <span>Aley, Lebanon · عاليه، لبنان</span>
                </div>
            </div>
        </footer>
    );
}
