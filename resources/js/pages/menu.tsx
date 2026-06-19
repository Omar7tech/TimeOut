import { CategoryGrid } from '@/components/menu/category-grid';
import { Button } from '@/components/ui/button';
import type { Category, OrderType } from '@/types';
import { Head } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

interface MenuProps {
    orderType: OrderType;
    orderTypeLabel: string;
    categories: Category[];
}

export default function Menu({ orderTypeLabel, categories }: MenuProps) {
    return (
        <>
            <Head title={`${orderTypeLabel} Menu`} />

            <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <img
                    src="/logos/timeout-logo.png"
                    alt="Time Out Snack"
                    className="h-10 select-none md:h-16"
                    draggable={false}
                />

                <Button
                    size="icon"
                    className="relative rounded-full bg-brand-red text-white hover:bg-brand-red/90"
                    aria-label="Cart"
                >
                    <ShoppingCart className="size-5" />
                </Button>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6">
                <CategoryGrid categories={categories} />
            </main>
        </>
    );
}
