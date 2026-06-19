import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

interface MenuProps {
    orderType: string;
    orderTypeLabel: string;
}

export default function Menu({ orderTypeLabel }: MenuProps) {
    return (
        <>
            <Head title={`${orderTypeLabel} Menu`} />

            <header className="flex items-center justify-between px-4 py-3">
                <img
                    src="/logos/timeout-logo.png"
                    alt="Time Out Snack"
                    className="h-10 select-none"
                    draggable={false}
                />

                <Button size="icon" variant="ghost" className="relative" aria-label="Cart">
                    <ShoppingCart className="size-5" />
                </Button>
            </header>

            <main className="px-4 py-6">
                <p className="text-center text-sm text-muted-foreground">{orderTypeLabel}</p>
            </main>
        </>
    );
}
