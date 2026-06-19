import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { Category } from '@/types';
import { Plus } from 'lucide-react';

interface CategoryAddonsDialogProps {
    category: Category;
}

function formatPrice(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

/**
 * Small button shown beside a category title when it has add-ons. Opens a
 * dialog that lists each add-on with its price — a centered modal on desktop
 * and a bottom sheet that slides up on mobile.
 */
export function CategoryAddonsDialog({ category }: CategoryAddonsDialogProps) {
    const addons = category.addons ?? [];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    aria-label={`${category.title} add-ons / الإضافات`}
                    className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-brand-yellow px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-black shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Plus className="size-5" />
                    <span>Add-ons</span>
                    <span dir="rtl">الإضافات</span>
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{category.title} add-ons</DialogTitle>
                    <DialogDescription>Optional extras you can add to items in this category.</DialogDescription>
                </DialogHeader>

                <ul className="flex flex-col gap-2">
                    {addons.map((addon, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between gap-3 rounded-lg border-2 border-neutral-700 bg-background px-3 py-2"
                        >
                            <span className="font-bold">{addon.name}</span>
                            <span className="rounded-md border-2 border-black bg-brand-red px-2 py-0.5 text-sm font-extrabold text-white">
                                {formatPrice(Number(addon.price))}
                            </span>
                        </li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    );
}
