import type { Category } from '@/types';
import { Link } from '@inertiajs/react';

interface CategoryCardProps {
    category: Category;
    /** Destination menu URL for the chosen order type. */
    href: string;
}

/**
 * A single red category box linking into the menu: image (or placeholder)
 * above the category name.
 */
export function CategoryCard({ category, href }: CategoryCardProps) {
    return (
        <Link
            href={href}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-white bg-brand-red p-3 text-white transition-transform hover:scale-[1.02] md:aspect-auto md:h-36 md:w-36"
        >
            {category.image ? (
                <img
                    src={category.image}
                    alt={category.title}
                    className="h-12 w-12 rounded-full object-cover md:h-16 md:w-16"
                    draggable={false}
                    loading="lazy"
                />
            ) : (
                <div className="h-12 w-12 rounded-full bg-white/20 md:h-16 md:w-16" />
            )}
            <span className="line-clamp-2 text-center text-xs font-bold md:text-sm">{category.title}</span>
        </Link>
    );
}
