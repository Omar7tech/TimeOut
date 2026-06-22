import { SmartImage } from '@/components/smart-image';
import type { Category } from '@/types';

interface CategoryCardProps {
    category: Category;
    onSelect: (category: Category) => void;
}

/**
 * A single neo-brutalist red category box: a large background-removed image (or
 * placeholder) above the name, with a hard offset shadow that lifts on hover.
 * Matches the filter pills' black border + shadow language. Scales with its grid cell.
 */
export function CategoryCard({ category, onSelect }: CategoryCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(category)}
            className="group relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-md border-2 border-black bg-brand-red p-2.5 text-white shadow-[4px_4px_0_0_#000] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
        >
            {category.image ? (
                <SmartImage
                    src={category.image}
                    alt={category.title}
                    className="aspect-square w-4/5 max-w-36 rounded-md bg-transparent"
                    imgClassName="object-contain transition-transform duration-150 group-hover:scale-105"
                    draggable={false}
                />
            ) : (
                <div className="aspect-square w-4/5 max-w-36 rounded-md bg-white/20" />
            )}

            <span className="line-clamp-2 text-center text-sm leading-tight font-black tracking-wide uppercase sm:text-base lg:text-lg">
                {category.title}
            </span>
        </button>
    );
}
