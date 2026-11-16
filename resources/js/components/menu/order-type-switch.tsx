import { Link, usePage } from '@inertiajs/react';
import { Bike, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderType } from '@/types';

const options = [
    {
        type: 'dine_in',
        label: 'Dine-in',
        arabic: 'بالمحل',
        href: '/menu/dine-in',
        icon: UtensilsCrossed,
    },
    {
        type: 'takeaway',
        label: 'Delivery',
        arabic: 'توصيل',
        href: '/menu/delivery',
        icon: Bike,
    },
] as const;

interface OrderTypeSwitchProps {
    current: OrderType;
    className?: string;
}

/**
 * Two-way switch between the dine-in and delivery menus. The chosen half is a
 * solid ink pill sliding over a soft track, each half labelled in both
 * languages so neither crowd has to guess.
 */
export function OrderTypeSwitch({ current, className }: OrderTypeSwitchProps) {
    const onlineOrderingActive = usePage().props.onlineOrderingActive;
    const activeIndex = current === 'takeaway' ? 1 : 0;

    return (
        <div
            className={cn(
                'relative grid grid-cols-2 rounded-full bg-muted p-1',
                className,
            )}
        >
            {/* The sliding pill under the chosen half. */}
            <span
                aria-hidden
                className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-foreground shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
            />

            {options.map((option) => {
                const active = current === option.type;
                const Icon = option.icon;
                // Delivery is only reachable while online ordering is active.
                const disabled =
                    option.type === 'takeaway' && !onlineOrderingActive;

                const content = (
                    <>
                        <Icon className="size-4 shrink-0" strokeWidth={2.2} />
                        <span>{option.label}</span>
                        <span
                            className={cn(
                                'hidden font-medium min-[360px]:inline',
                                active
                                    ? 'text-background/60'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {option.arabic}
                        </span>
                    </>
                );

                const className = cn(
                    'relative z-10 flex min-h-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    active
                        ? 'text-background'
                        : 'text-foreground/75 hover:text-foreground',
                    disabled && 'cursor-not-allowed opacity-40 hover:text-foreground/75',
                );

                if (disabled) {
                    return (
                        <span
                            key={option.type}
                            aria-disabled="true"
                            title="Online ordering is currently unavailable"
                            className={className}
                        >
                            {content}
                        </span>
                    );
                }

                return (
                    <Link
                        key={option.type}
                        href={option.href}
                        aria-current={active ? 'page' : undefined}
                        className={className}
                    >
                        {content}
                    </Link>
                );
            })}
        </div>
    );
}
