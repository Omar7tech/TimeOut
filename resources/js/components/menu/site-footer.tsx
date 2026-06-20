import { BrandLogo } from '@/components/brand-logo';
import type { Category } from '@/types';

interface SiteFooterProps {
    categories: Category[];
    /** Jump to a category in the menu above (same client-side filter as the pills). */
    onSelectCategory?: (id: number) => void;
}

const socials = [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'Call us', href: 'tel:+961' },
] as const;

/**
 * Footer that mirrors the header: the same cream zigzag band, logo, and uppercase
 * type. A torn-paper edge runs along the top so it reads as the page's closing strip.
 */
export function SiteFooter({ categories, onSelectCategory }: SiteFooterProps) {
    return (
        <footer className="footer-zigzag mt-16 pt-12">
            <div className="mx-auto max-w-7xl px-4 pb-8 md:px-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <BrandLogo className="h-12 md:h-14" />
                        <p className="mt-3 text-sm font-medium text-muted-foreground">
                            Fresh snacks, made to order. Take a time out and treat yourself.
                        </p>
                    </div>

                    {/* Category quick-jump */}
                    <nav>
                        <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-brand-red">
                            Categories
                        </h3>
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <button
                                        type="button"
                                        onClick={() => onSelectCategory?.(category.id)}
                                        className="text-sm font-bold uppercase tracking-wide text-foreground/70 transition-colors hover:text-foreground"
                                    >
                                        {category.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Socials */}
                    <nav>
                        <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-brand-red">
                            Follow
                        </h3>
                        <ul className="flex flex-col gap-1.5">
                            {socials.map((social) => (
                                <li key={social.label}>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm font-bold uppercase tracking-wide text-foreground/70 transition-colors hover:text-foreground"
                                    >
                                        {social.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-1 border-t-2 border-black/10 pt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground md:flex-row">
                    <span>© {new Date().getFullYear()} Time Out Snack</span>
                    <span>All rights reserved</span>
                </div>
            </div>
        </footer>
    );
}
