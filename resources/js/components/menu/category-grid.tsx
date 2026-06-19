import { CategoryCard } from '@/components/menu/category-card';
import type { Category } from '@/types';

interface CategoryGridProps {
    categories: Category[];
    onSelect: (category: Category) => void;
}

/**
 * Responsive grid of category boxes, scaling from 3 columns on mobile up to
 * 6 on extra-large screens.
 */
export function CategoryGrid({ categories, onSelect }: CategoryGridProps) {
    return (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
            {categories.map((category) => (
                <CategoryCard key={category.id} category={category} onSelect={onSelect} />
            ))}
        </div>
    );
}
