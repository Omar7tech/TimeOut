import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { usePricing } from '@/hooks/use-pricing';
import type { Category } from '@/types';

interface CategoryAddonsDialogProps {
    category: Category;
}

/**
 * Small button shown beside a category title when it has add-ons. Opens a
 * dialog that lists each add-on with its price — a centered modal on desktop
 * and a bottom sheet that slides up on mobile.
 */
export function CategoryAddonsDialog({ category }: CategoryAddonsDialogProps) {
    const pricing = usePricing();
    const addons = category.addons ?? [];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    aria-label={`${category.title} add-ons / الإضافات`}
                    className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-muted px-3.5 font-display text-sm font-bold whitespace-nowrap transition-[background-color,scale] duration-200 hover:bg-raised focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]"
                >
                    <Plus
                        className="size-4 text-brand-red-ink"
                        strokeWidth={2.6}
                    />
                    <span lang="ar">الإضافات</span>
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle dir="auto" className="pe-10">
                        {category.title} · الإضافات
                    </DialogTitle>
                    <DialogDescription>
                        Optional extras you can add to items in this category.
                    </DialogDescription>
                </DialogHeader>

                <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl bg-muted/60">
                    {addons.map((addon, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between gap-3 px-4 py-3"
                        >
                            <span dir="auto" className="font-semibold">
                                {addon.name}
                            </span>
                            <span
                                dir="ltr"
                                className="inline-flex flex-col items-end font-display text-sm leading-tight font-bold tabular-nums"
                            >
                                <span>
                                    {pricing.primary(Number(addon.price))}
                                </span>
                                {pricing.showLbp && pricing.showUsd && (
                                    <span className="font-sans text-[0.6875rem] font-medium text-muted-foreground">
                                        {pricing.usd(Number(addon.price))}
                                    </span>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    );
}
