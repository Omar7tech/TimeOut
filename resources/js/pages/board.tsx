import { Head } from '@inertiajs/react';
import { BoardSlider } from '@/components/menu/board-slider';
import { useWakeLock } from '@/hooks/use-wake-lock';
import type { Slide } from '@/types';

interface BoardProps {
    screen: {
        name: string;
        orientation: 'landscape' | 'portrait';
        /** Seconds each slide stays on screen before auto-advancing. */
        rotation_seconds: number;
        /** Whether product slides show their prices. */
        display_prices: boolean;
    };
    slides: Slide[];
}

/**
 * Full-screen Menu Board shown on an in-store Smart TV. It is entirely passive:
 * a non-interactive carousel that cycles through the board's slides, showing
 * each linked product's details and prices. There is no header, navigation, or
 * cart — nothing here is meant to be touched.
 */
export default function Board({ screen, slides }: BoardProps) {
    // Keep the TV awake for as long as the board is open.
    useWakeLock();

    return (
        <>
            <Head title={`${screen.name} - Menu Board`} />

            <main className="h-screen w-screen overflow-hidden bg-black">
                {slides.length > 0 ? (
                    <BoardSlider
                        slides={slides}
                        rotationSeconds={screen.rotation_seconds}
                        showPrices={screen.display_prices}
                    />
                ) : (
                    <div className="grid h-full place-items-center">
                        <p className="text-lg font-semibold text-white/60">
                            No slides yet.
                        </p>
                    </div>
                )}
            </main>
        </>
    );
}
