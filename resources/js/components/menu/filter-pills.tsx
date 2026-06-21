import { cn } from '@/lib/utils';
import type { Category } from '@/types';

export type MenuFilter = number | 'today';

interface FilterPillsProps {
    categories: Category[];
    activeId: MenuFilter;
    onSelect: (id: MenuFilter) => void;
}

const base =
    'shrink-0 snap-start whitespace-nowrap rounded-md border-2 border-black font-bold uppercase tracking-wide transition-all px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base';

/** Resting state: hard offset shadow that lifts on hover. */
const raised =
    'shadow-[3px_3px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] md:shadow-[4px_4px_0_0_#000] md:hover:shadow-[5px_5px_0_0_#000]';

/** Active state: pressed into the shadow. */
const pressed = 'translate-x-[3px] translate-y-[3px] shadow-none';

/** Polka-dot texture layered over the active pill's fill. */
const stripesOnDark =
    '[background-image:radial-gradient(rgba(255,255,255,0.22)_1.5px,transparent_1.5px)] [background-size:8px_8px]';
const stripesOnLight =
    '[background-image:radial-gradient(rgba(0,0,0,0.14)_1.5px,transparent_1.5px)] [background-size:8px_8px]';

/**
 * Neo-brutalist filter pills above the products: a yellow "Available today"
 * pill first, then one per category. Selecting one swaps the products client-side.
 */
export function FilterPills({
    categories,
    activeId,
    onSelect,
}: FilterPillsProps) {
    const todayActive = activeId === 'today';

    return (
        <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:gap-3 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
            <button
                type="button"
                onClick={() => onSelect('today')}
                className={cn(
                    base,
                    'bg-brand-yellow text-black',
                    todayActive ? cn(pressed, stripesOnLight) : raised,
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
                            base,
                            active
                                ? cn(
                                      'bg-brand-red text-white',
                                      pressed,
                                      stripesOnDark,
                                  )
                                : cn('bg-white text-black', raised),
                        )}
                    >
                        {category.title}
                    </button>
                );
            })}
        </div>
    );
}
