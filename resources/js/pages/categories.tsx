import { CategoryGrid } from '@/components/menu/category-grid';
import { SiteHeader } from '@/components/menu/site-header';
import type { Category, OrderType } from '@/types';
import { Head } from '@inertiajs/react';

interface CategoriesProps {
    orderType: OrderType;
    orderTypeLabel: string;
    menuUrl: string;
    categories: Category[];
}

export default function Categories({ orderTypeLabel, menuUrl, categories }: CategoriesProps) {
    return (
        <>
            <Head title={`${orderTypeLabel} Categories`} />

            <SiteHeader />

            <main className="mx-auto max-w-7xl px-4 py-6">
                <CategoryGrid categories={categories} menuUrl={menuUrl} />
            </main>
        </>
    );
}
