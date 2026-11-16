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
import { cn } from '@/lib/utils';
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
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-muted px-4 text-sm font-semibold transition-[background-color,scale] duration-200 hover:bg-raised active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                    <Plus className="size-4 text-brand-red-ink" strokeWidth={2.6} />
                    <span>Extras</span>
                    <span className="text-muted-foreground">· الإضافات</span>
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
                            <span dir="ltr"
                                className="inline-flex flex-col items-end font-display text-sm leading-tight font-bold tabular-nums">
                                {pricing.showUsd && (
                                    <span>
                                        {pricing.usd(Number(addon.price))}
                                    </span>
                                )}
                                {pricing.showLbp && (
                                    <span
                                        className={cn(
                                            pricing.showUsd &&
                                                'font-sans text-[0.6875rem] font-medium text-muted-foreground',
                                        )}
                                    >
                                        {pricing.lbp(Number(addon.price))}
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
