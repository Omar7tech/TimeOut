import { usePage } from '@inertiajs/react';
import { BrandLogo } from '@/components/brand-logo';
import { FooterHours } from '@/components/menu/footer-hours';
import type { Category } from '@/types';

interface SiteFooterProps {
    categories: Category[];
    /** Jump to a category in the menu above (same client-side filter as the pills). */
    onSelectCategory?: (id: number) => void;
}

/**
 * Footer that mirrors the header: the same cream zigzag band, logo, and uppercase
 * type. A torn-paper edge runs along the top so it reads as the page's closing strip.
 */
export function SiteFooter({ categories, onSelectCategory }: SiteFooterProps) {
    const socials = usePage().props.socials;

    return (
        <footer className="footer-zigzag mt-16 pt-12">
            <div className="mx-auto max-w-7xl px-4 pb-8 md:px-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <BrandLogo className="h-12 md:h-14" />
                        <p className="mt-3 text-sm font-medium text-muted-foreground">
                            Fresh snacks, made to order. Take a time out and
                            treat yourself.
                        </p>
                    </div>

                    {/* Category quick-jump */}
                    <nav>
                        <h3 className="mb-3 text-xs font-black tracking-widest text-brand-red uppercase">
                            Categories
                        </h3>
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSelectCategory?.(category.id)
                                        }
                                        className="text-sm font-bold tracking-wide text-foreground/70 uppercase transition-colors hover:text-foreground"
                                    >
                                        {category.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Opening hours (automatic mode only) */}
                    <FooterHours />

                    {/* Socials */}
                    {socials.length > 0 && (
                        <nav>
                            <h3 className="mb-3 text-xs font-black tracking-widest text-brand-red uppercase">
                                Follow
                            </h3>
                            <ul className="flex items-center gap-3">
                                {socials.map((social) => (
                                    <li key={social.platform}>
                                        <a
                                            href={social.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={social.label}
                                            title={social.label}
                                            className="flex size-10 items-center justify-center rounded-full bg-foreground/5 transition-colors hover:bg-foreground/10"
                                        >
                                            <img
                                                src={social.icon}
                                                alt=""
                                                className="size-6"
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-1 border-t-2 border-black/10 pt-4 text-xs font-bold tracking-wide text-muted-foreground uppercase md:flex-row">
                    <span>© {new Date().getFullYear()} Time Out Snack</span>
                    <span>All rights reserved</span>
                </div>
            </div>
        </footer>
    );
}
