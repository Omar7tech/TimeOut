import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Time Out Snack" />

            <main className="flex min-h-dvh flex-col items-center justify-center gap-12  px-6 py-16">
                <img
                    src="/logos/timeout-logo.png"
                    alt="Time Out Snack"
                    className="w-full max-w-xs select-none"
                    draggable={false}
                />

                <div className="flex w-full max-w-xs items-center justify-center gap-4">
                    <Link
                        href="/menu/dine-in"
                        className="flex-1 rounded-lg bg-[#e11d28] px-6 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[#c4151f] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                        Dine In
                    </Link>

                    <Link
                        href="/menu/delivery"
                        className="flex-1 rounded-lg bg-[#e11d28] px-6 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[#c4151f] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                        Delivery
                    </Link>
                </div>
            </main>
        </>
    );
}
