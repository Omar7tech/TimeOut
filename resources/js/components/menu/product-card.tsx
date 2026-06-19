import type { Product } from '@/types';
import { Star } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

function formatPrice(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

/**
 * Menu item card: image, title/subtitle, and price (with discount), in a
 * neo-brutalist style with a hard offset shadow that lifts on hover.
 */
export function ProductCard({ product }: ProductCardProps) {
    const hasDiscount = product.discount_price !== null;
    const image = product.thumb ?? product.image;

    return (
        <div className="group flex gap-4 rounded-lg border-2 border-neutral-700 bg-card p-3 text-card-foreground shadow-[4px_4px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000]">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-md">
                {image ? (
                    <img
                        src={image}
                        alt={product.title}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        draggable={false}
                        loading="lazy"
                    />
                ) : (
                    <div className="size-full bg-muted" />
                )}

                {product.available_today && (
                    <span className="absolute left-1 top-1 rounded border border-black bg-brand-yellow px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-black">
                        Today
                    </span>
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-base font-black leading-tight">{product.title}</h3>
                    {product.is_featured && (
                        <Star className="size-4 shrink-0 fill-brand-yellow text-brand-yellow" />
                    )}
                </div>

                {product.subtitle && (
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{product.subtitle}</p>
                )}

                <div className="mt-auto flex items-center gap-2 pt-2">
                    {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
                    )}
                    <span className="rounded-md border-2 border-black bg-brand-red px-2 py-0.5 font-extrabold text-white">
                        {formatPrice(hasDiscount ? (product.discount_price as number) : product.price)}
                    </span>
                </div>
            </div>
        </div>
    );
}
