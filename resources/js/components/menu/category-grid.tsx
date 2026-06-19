import { CategoryCard } from '@/components/menu/category-card';
import type { Category } from '@/types';

interface CategoryGridProps {
    categories: Category[];
    /** Menu URL the cards link to (same for every category of this order type). */
    menuUrl: string;
}

/**
 * Responsive grid of category boxes: 3 columns on mobile, wrapping on desktop.
 */
export function CategoryGrid({ categories, menuUrl }: CategoryGridProps) {
    return (
        <div className="grid grid-cols-3 gap-1 md:flex md:flex-wrap md:gap-4">
            {categories.map((category) => (
                <CategoryCard key={category.id} category={category} href={menuUrl} />
            ))}
        </div>
    );
}
