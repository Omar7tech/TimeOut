import { Link, usePage } from '@inertiajs/react';
import { Bike, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderType } from '@/types';

const options = [
    {
        type: 'dine_in',
        label: 'Dine-in',
        href: '/menu/dine-in',
        icon: UtensilsCrossed,
    },
    { type: 'takeaway', label: 'Delivery', href: '/menu/delivery', icon: Bike },
] as const;

interface OrderTypeSwitchProps {
    current: OrderType;
}

/** Segmented toggle to switch between the dine-in and delivery menus. */
export function OrderTypeSwitch({ current }: OrderTypeSwitchProps) {
    const onlineOrderingActive = usePage().props.onlineOrderingActive;

    return (
        <div className="inline-flex shrink-0 overflow-hidden rounded-md border-2 border-black shadow-[2px_2px_0_0_#000]">
            {options.map((option) => {
                const active = current === option.type;
                const Icon = option.icon;
                // Delivery is only reachable while online ordering is active.
                const disabled =
                    option.type === 'takeaway' && !onlineOrderingActive;

                const className = cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold tracking-wide uppercase transition-colors not-first:-ml-px not-first:border-l-2 not-first:border-black',
                    active
                        ? 'bg-brand-red text-white'
                        : 'bg-card text-card-foreground hover:bg-muted',
                    disabled &&
                        'cursor-not-allowed bg-muted text-muted-foreground/50 hover:bg-muted',
                );

                if (disabled) {
                    return (
                        <span
                            key={option.type}
                            aria-disabled="true"
                            title="Online ordering is currently unavailable"
                            className={className}
                        >
                            <Icon className="size-3.5" />
                            <span className="hidden sm:inline">
                                {option.label}
                            </span>
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
                        <Icon className="size-3.5" />
                        <span className="hidden sm:inline">{option.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
