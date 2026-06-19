import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Time Out Snack" />

            <main className="flex min-h-dvh flex-col items-center justify-center gap-12 px-6 py-16">
                <img
                    src="/logos/timeout-logo.png"
                    alt="Time Out Snack"
                    className="w-full max-w-xs select-none"
                    draggable={false}
                />

                <div className="flex w-full max-w-xs items-center justify-center gap-4">
                    <Button
                        asChild
                        size="lg"
                        className="h-12 flex-1 bg-brand-red text-base font-bold text-white hover:bg-brand-red/90"
                    >
                        <Link href="/categories/dine-in">Dine In</Link>
                    </Button>

                    <Button
                        asChild
                        size="lg"
                        className="h-12 flex-1 bg-brand-red text-base font-bold text-white hover:bg-brand-red/90"
                    >
                        <Link href="/categories/delivery">Delivery</Link>
                    </Button>
                </div>
            </main>
        </>
    );
}
