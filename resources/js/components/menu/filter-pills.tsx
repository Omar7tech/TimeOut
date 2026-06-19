import type { Category } from '@/types';
import { cn } from '@/lib/utils';

export type MenuFilter = number | 'today';

interface FilterPillsProps {
    categories: Category[];
    activeId: MenuFilter;
    onSelect: (id: MenuFilter) => void;
}

/**
 * Row of filter pills shown above the products: a highlighted "Available today"
 * pill first, then one pill per category. Selecting one swaps the products
 * client-side.
 */
export function FilterPills({ categories, activeId, onSelect }: FilterPillsProps) {
    const todayActive = activeId === 'today';

    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => onSelect('today')}
                className={cn(
                    'rounded-full border px-3 py-1 text-sm font-semibold transition-colors',
                    todayActive
                        ? 'border-brand-yellow bg-brand-yellow text-black'
                        : 'border-brand-yellow text-foreground hover:bg-brand-yellow/10',
                )}
            >
                Available today
            </button>

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
