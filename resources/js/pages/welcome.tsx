import { Head, Link } from '@inertiajs/react';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';

const buttonClass = cn(
    'inline-flex h-12 flex-1 items-center justify-center rounded-md border-2 border-black bg-brand-red text-base font-extrabold tracking-wide text-white uppercase',
    'shadow-[4px_4px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000]',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
);

export default function Welcome() {
    return (
        <>
            <Head title="Time Out Snack" />

            <main className="flex min-h-dvh flex-col items-center justify-center gap-12 px-6 py-16">
                <BrandLogo className="w-full max-w-xs" />

                <div className="flex w-full max-w-xs items-center justify-center gap-4">
                    <Link href="/menu/dine-in" className={buttonClass}>
                        Dine In
                    </Link>

                    <Link href="/menu/delivery" className={buttonClass}>
                        Delivery
                    </Link>
                </div>
            </main>
        </>
    );
}
