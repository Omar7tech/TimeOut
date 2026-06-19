import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

type OrderType = 'dine_in' | 'takeaway' | 'both';

interface ProductVariant {
    name: string;
    price: number;
    discount_price: number | null;
}

interface Product {
    id: number;
    title: string;
    slug: string;
    subtitle: string | null;
    description: string | null;
    price: number;
    discount_price: number | null;
    order_type: OrderType;
    preparation_time: number | null;
    is_featured: boolean;
    variants: ProductVariant[] | null;
    image: string | null;
}

interface Category {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    products: Product[];
}

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
                <div className="grid grid-cols-3 gap-1 md:flex md:flex-wrap md:gap-4">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-white bg-brand-red p-3 text-white transition-transform hover:scale-[1.02] md:aspect-auto md:h-36 md:w-36"
                        >
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.title}
                                    className="h-12 w-12 rounded-full object-cover md:h-16 md:w-16"
                                    draggable={false}
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-white/20 md:h-16 md:w-16" />
                            )}
                            <span className="line-clamp-2 text-center text-xs font-bold md:text-sm">
                                {category.title}
                            </span>
                        </button>
                    ))}
                </div>
            </main>
        </>
    );
}
