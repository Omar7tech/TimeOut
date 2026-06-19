import { cn } from '@/lib/utils';
import type { OrderType } from '@/types';
import { Link } from '@inertiajs/react';
import { Bike, UtensilsCrossed } from 'lucide-react';

const options = [
    { type: 'dine_in', label: 'Dine-in', href: '/menu/dine-in', icon: UtensilsCrossed },
    { type: 'takeaway', label: 'Delivery', href: '/menu/delivery', icon: Bike },
] as const;

interface OrderTypeSwitchProps {
    current: OrderType;
}

/** Segmented toggle to switch between the dine-in and delivery menus. */
export function OrderTypeSwitch({ current }: OrderTypeSwitchProps) {
    return (
        <div className="inline-flex shrink-0 overflow-hidden rounded-md border-2 border-black shadow-[2px_2px_0_0_#000]">
            {options.map((option) => {
                const active = current === option.type;
                const Icon = option.icon;

                return (
                    <Link
                        key={option.type}
                        href={option.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide transition-colors not-first:-ml-px not-first:border-l-2 not-first:border-black',
                            active ? 'bg-brand-red text-white' : 'bg-card text-card-foreground hover:bg-muted',
                        )}
                    >
                        <Icon className="size-3.5" />
                        <span className="hidden sm:inline">{option.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
