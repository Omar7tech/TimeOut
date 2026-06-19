import type { Category } from '@/types';
import { Link } from '@inertiajs/react';

interface CategoryCardProps {
    category: Category;
    /** Destination menu URL for the chosen order type. */
    href: string;
}

/**
 * A single red category box linking into the menu: a circular image (or
 * placeholder) above the category name. Scales with its grid cell.
 */
export function CategoryCard({ category, href }: CategoryCardProps) {
    return (
        <Link
            href={href}
            className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border-2 border-white/90 bg-brand-red p-3 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
            {category.image ? (
                <img
                    src={category.image}
                    alt={category.title}
                    className="aspect-square w-3/5 max-w-28 rounded-lg object-cover"
                    draggable={false}
                    loading="lazy"
                />
            ) : (
                <div className="aspect-square w-3/5 max-w-28 rounded-lg bg-white/20" />
            )}
            <span className="line-clamp-2 text-center text-sm font-extrabold leading-tight sm:text-base lg:text-lg">
                {category.title}
            </span>
        </Link>
    );
}
