import { Head, Link } from '@inertiajs/react';
import { Bike, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { useShopOpen } from '@/lib/shop';
import { cn } from '@/lib/utils';

const buttonClass = cn(
    'group relative h-12 flex-1 overflow-hidden rounded-md border-2 border-black bg-brand-red text-base font-extrabold tracking-wide text-white uppercase',
    'shadow-[4px_4px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000]',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
);

/**
 * Landing CTA: shows its label by default, and on desktop hover the text slides
 * up out of view while the related icon rises in to replace it.
 */
function MenuLink({
    href,
    label,
    icon: Icon,
}: {
    href: string;
    label: string;
    icon: LucideIcon;
}) {
    return (
        <Link href={href} className={buttonClass}>
            <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out group-hover:translate-y-[-160%] group-hover:opacity-0">
                {label}
            </span>
            <span
                aria-hidden
                className="absolute inset-0 flex translate-y-[160%] items-center justify-center opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100"
            >
                <Icon className="size-6" />
            </span>
        </Link>
    );
}

export default function Welcome() {
    const open = useShopOpen();

    return (
        <>
            <Head title="Time Out Snack" />

            <main className="flex min-h-dvh flex-col items-center justify-center gap-12 px-6 py-16">
                <BrandLogo className="w-full max-w-xs" />

                <div className="flex w-full max-w-xs flex-col items-center gap-5">
                    <div className="flex w-full items-center justify-center gap-4">
                        <MenuLink
                            href="/menu/dine-in"
                            label="Dine In"
                            icon={UtensilsCrossed}
                        />

                        <MenuLink
                            href="/menu/delivery"
                            label="Delivery"
                            icon={Bike}
                        />
                    </div>

                    {!open && (
                        <div className="flex w-full flex-col gap-1 border-t-2 border-dashed border-black/25 pt-4 text-center text-sm font-bold">
                            <p>
                                We're closed
                                <span className="text-brand-red">.</span> Fill
                                your cart and order the moment we reopen.
                            </p>
                            <p dir="rtl" className="text-muted-foreground">
                                نحن مغلقون
                                <span className="text-brand-red">.</span> املأ
                                سلتك واطلب فور أن نفتح.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
