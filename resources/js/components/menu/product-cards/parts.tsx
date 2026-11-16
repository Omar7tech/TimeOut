import { Eye, Plus, Star } from 'lucide-react';
import { CategoryIcon } from '@/components/menu/category-icon';
import { DietIcons } from '@/components/menu/diet-icons';
import { cn } from '@/lib/utils';
import type { Category, Product } from '@/types';

/**
 * The small marks a dish can carry: today's special, a house favourite, spicy
 * and vegan. Shared by every card design so a mark means the same thing
 * wherever it shows.
 */
export function ProductMarks({
    product,
    className,
}: {
    product: Product;
    className?: string;
}) {
    if (
        !product.available_today &&
        !product.is_featured &&
        !product.is_spicy &&
        !product.is_vegan
    ) {
        return null;
    }

    return (
        <span className={cn('flex shrink-0 items-center gap-1.5', className)}>
            {product.available_today && (
                <span className="rounded-full bg-brand-yellow px-2 py-0.5 text-[0.625rem] leading-4 font-bold text-black">
                    اليوم · Today
                </span>
            )}
            {product.is_featured && (
                <Star
                    aria-label="House favourite"
                    className="size-4 fill-brand-yellow text-brand-yellow"
                />
            )}
            <DietIcons product={product} iconClassName="size-4" />
        </span>
    );
}

/**
 * The image stand-in for a dish without a photograph: the dish's first letter
 * in the display face over a faint sunburst, so the grid keeps its rhythm.
 */
export function ProductInitial({
    title,
    category,
    className,
}: {
    title: string;
    /** The dish's section; when given, its icon stands in for the photo. */
    category?: Pick<Category, 'title' | 'image'> | null;
    className?: string;
}) {
    if (category) {
        return (
            <span
                aria-hidden
                className={cn(
                    'grid place-items-center bg-brand-red/12 text-brand-red-ink',
                    className,
                )}
            >
                <CategoryIcon category={category} className="size-[46%]" />
            </span>
        );
    }

    return (
        <span
            aria-hidden
            className={cn(
                'relative grid place-items-center overflow-hidden bg-surface',
                className,
            )}
        >
            <span className="sunburst absolute inset-[-40%] opacity-20 [--ray:var(--brand-red)]" />
            <span className="relative font-display text-3xl font-black text-brand-red">
                {Array.from(title)[0]}
            </span>
        </span>
    );
}

/** The round red quick-add button. */
export function AddButton({
    title,
    onClick,
    className,
}: {
    title: string;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={(event) => {
                event.stopPropagation();
                onClick();
            }}
            aria-label={`Add ${title} to cart`}
            className={cn(
                'relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-red text-brand-ink shadow-[0_6px_16px_-6px_rgb(255_102_0/0.7)] transition-[scale,background-color] duration-200 hover:scale-105 hover:bg-brand-red/90 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none',
                className,
            )}
        >
            <Plus className="size-5" strokeWidth={2.6} />
        </button>
    );
}

/** The quiet "view details" button shown on the dine-in menu instead of add. */
export function ViewButton({
    title,
    onClick,
    className,
}: {
    title: string;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={(event) => {
                event.stopPropagation();
                onClick();
            }}
            aria-label={`View ${title}`}
            className={cn(
                'relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-[scale,background-color] duration-200 hover:bg-foreground hover:text-background active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                className,
            )}
        >
            <Eye className="size-[1.125rem]" strokeWidth={2.2} />
        </button>
    );
}

/**
 * Covers the whole card under its content so the card itself opens the dish,
 * while the size chips and the add button stay real buttons on top of it.
 */
export function CardTarget({
    title,
    onOpen,
    className,
}: {
    title: string;
    onOpen: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className={cn(
                'absolute inset-0 z-0 rounded-[inherit] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                className,
            )}
        >
            <span className="sr-only">View {title}</span>
        </button>
    );
}
