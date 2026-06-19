import type { Category } from '@/types';
import { cn } from '@/lib/utils';

interface FilterPillsProps {
    categories: Category[];
    activeId: number;
    onSelect: (id: number) => void;
}

/**
 * Row of category filter pills shown above the products. The active category
 * is highlighted; selecting another swaps the products client-side.
 */
export function FilterPills({ categories, activeId, onSelect }: FilterPillsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
                const active = category.id === activeId;

                return (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => onSelect(category.id)}
                        className={cn(
                            'rounded-full border px-3 py-1 text-sm font-semibold transition-colors',
                            active
                                ? 'border-brand-red bg-brand-red text-white'
                                : 'border-border text-foreground hover:bg-muted',
                        )}
                    >
                        {category.title}
                    </button>
                );
            })}
        </div>
    );
}
