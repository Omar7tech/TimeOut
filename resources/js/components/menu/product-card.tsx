import type { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

function formatPrice(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

/**
 * Simple menu line item: image, title/subtitle, and price (with discount).
 */
export function ProductCard({ product }: ProductCardProps) {
    const hasDiscount = product.discount_price !== null;
    const image = product.thumb ?? product.image;

    return (
        <div className="flex gap-3 rounded-lg border border-border p-3">
            {image ? (
                <img
                    src={image}
                    alt={product.title}
                    className="size-16 shrink-0 rounded-md object-cover"
                    draggable={false}
                    loading="lazy"
                />
            ) : (
                <div className="size-16 shrink-0 rounded-md bg-muted" />
            )}

            <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="truncate font-bold">{product.title}</h3>
                {product.subtitle && (
                    <p className="truncate text-sm text-muted-foreground">{product.subtitle}</p>
                )}

                <div className="mt-auto flex items-center gap-2">
                    {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.price)}
                        </span>
                    )}
                    <span className="font-bold text-brand-red">
                        {formatPrice(hasDiscount ? (product.discount_price as number) : product.price)}
                    </span>
                </div>
            </div>
        </div>
    );
}
