import type { Category } from '@/types';
import { cn } from '@/lib/utils';

export type MenuFilter = number | 'today';

interface FilterPillsProps {
    categories: Category[];
    activeId: MenuFilter;
    onSelect: (id: MenuFilter) => void;
}

const base =
    'rounded-md border-2 border-black font-bold uppercase tracking-wide transition-all px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base';

/** Resting state: hard offset shadow that lifts on hover. */
const raised =
    'shadow-[3px_3px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] md:shadow-[4px_4px_0_0_#000] md:hover:shadow-[5px_5px_0_0_#000]';

/** Active state: pressed into the shadow. */
const pressed = 'translate-x-[3px] translate-y-[3px] shadow-none';

/**
 * Neo-brutalist filter pills above the products: a yellow "Available today"
 * pill first, then one per category. Selecting one swaps the products client-side.
 */
export function FilterPills({ categories, activeId, onSelect }: FilterPillsProps) {
    const todayActive = activeId === 'today';

    return (
        <div className="flex flex-wrap gap-2 md:gap-3">
            <button
                type="button"
                onClick={() => onSelect('today')}
                className={cn(base, 'bg-brand-yellow text-black', todayActive ? pressed : raised)}
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
                            base,
                            active ? cn('bg-brand-red text-white', pressed) : cn('bg-white text-black', raised),
                        )}
                    >
                        {category.title}
                    </button>
                );
            })}
        </div>
    );
}
