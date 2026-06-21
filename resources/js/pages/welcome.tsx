import { Head, Link } from '@inertiajs/react';
import { BrandLogo } from '@/components/brand-logo';
import { useShopOpen } from '@/lib/shop';
import { cn } from '@/lib/utils';

const buttonClass = cn(
    'inline-flex h-12 flex-1 items-center justify-center rounded-md border-2 border-black bg-brand-red text-base font-extrabold tracking-wide text-white uppercase',
    'shadow-[4px_4px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000]',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
);

export default function Welcome() {
    const open = useShopOpen();

    return (
        <>
            <Head title="Time Out Snack" />

            <main className="flex min-h-dvh flex-col items-center justify-center gap-12 px-6 py-16">
                <BrandLogo className="w-full max-w-xs" />

                <div className="flex w-full max-w-xs flex-col items-center gap-5">
                    <div className="flex w-full items-center justify-center gap-4">
                        <Link href="/menu/dine-in" className={buttonClass}>
                            Dine In
                        </Link>

                        <Link href="/menu/delivery" className={buttonClass}>
                            Delivery
                        </Link>
                    </div>

                    {!open && (
                        <div className="flex max-w-sm flex-col gap-1.5 border-t-2 border-dashed border-black/15 pt-4 text-center text-sm font-semibold text-muted-foreground">
                            <p>
                                We're closed right now — browse the menu and fill
                                your cart. You can place your order as soon as
                                we're open again.
                            </p>
                            <p dir="rtl" className="leading-relaxed">
                                نحن مغلقون حاليًا — تصفّح القائمة واملأ سلتك،
                                وبإمكانك إتمام طلبك فور أن نفتح من جديد.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
