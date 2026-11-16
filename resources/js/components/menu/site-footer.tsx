import { usePage } from '@inertiajs/react';
import { BrandLogo } from '@/components/brand-logo';
import { FooterHours } from '@/components/menu/footer-hours';
import type { Category } from '@/types';

interface SiteFooterProps {
    categories: Category[];
    /** Jump to a section of the menu above (same client-side filter as the pills). */
    onSelectCategory?: (id: number) => void;
}

/**
 * The close of the page: the logo with the shop's line, the sections as a
 * quick index, the hours, and the socials, on the darker surface band. The
 * logo's red lines run the full width at the very foot.
 */
export function SiteFooter({ categories, onSelectCategory }: SiteFooterProps) {
    const socials = usePage().props.socials;

    return (
        <footer className="mt-20 bg-surface">
            <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 md:px-6 md:pt-16">
                <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr] md:gap-12">
                    <div className="flex flex-col items-start gap-4">
                        <BrandLogo className="h-14 md:h-16" />
                        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                            Shawarma, burgers and sandwiches made to order in
                            Aley.
                            <span lang="ar" dir="rtl" className="mt-1 block">
                                شاورما، برغر وسندويشات عالطلب في عاليه.
                            </span>
                        </p>

                        {socials.length > 0 && (
                            <ul className="mt-1 flex items-center gap-2">
                                {socials.map((social) => (
                                    <li key={social.platform}>
                                        <a
                                            href={social.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={social.label}
                                            title={social.label}
                                            className="flex size-11 items-center justify-center rounded-full bg-card ring-1 ring-border transition-[translate,background-color] duration-200 hover:-translate-y-0.5 hover:bg-raised active:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
                    </div>

                    <nav aria-label="Menu sections">
                        <h3 className="mb-3 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                            Sections · الأقسام
                        </h3>
                        <ul className="grid grid-cols-2 gap-x-6">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSelectCategory?.(category.id)
                                        }
                                        dir="auto"
                                        className="inline-flex min-h-11 items-center font-display text-[0.9375rem] font-bold text-foreground/80 rounded-md underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    >
                                        {category.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <FooterHours />
                </div>

                <div className="mt-12 flex flex-col justify-between gap-1 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row">
                    <span>© {new Date().getFullYear()} Time Out Snack</span>
                    <span>Aley, Lebanon · عاليه، لبنان</span>
                </div>
            </div>

        </footer>
    );
}
