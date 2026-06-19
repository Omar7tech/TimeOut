import type { Category } from '@/types';

interface CategoryCardProps {
    category: Category;
    onSelect: (category: Category) => void;
}

/**
 * A single red category box: a square image (or placeholder) above the name.
 * Selecting it reveals that category's products. Scales with its grid cell.
 */
export function CategoryCard({ category, onSelect }: CategoryCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(category)}
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
        </button>
    );
}
