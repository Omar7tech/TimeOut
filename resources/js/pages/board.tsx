import { Head } from '@inertiajs/react';
import { BoardGrid } from '@/components/menu/board-grid';
import { BoardShowcase } from '@/components/menu/board-showcase';
import { BoardSlider } from '@/components/menu/board-slider';
import { useWakeLock } from '@/hooks/use-wake-lock';
import type { BoardLayout, Slide } from '@/types';

interface BoardProps {
    screen: {
        name: string;
        orientation: 'landscape' | 'portrait';
        /** How each slide is presented on the screen. */
        layout: BoardLayout;
        /** Seconds each slide stays on screen before auto-advancing. */
        rotation_seconds: number;
        /** Whether product slides show their prices. */
        display_prices: boolean;
        /** Restaurant logo URL to overlay, or null when hidden. */
        logo: string | null;
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

            <main className="relative h-screen w-screen overflow-hidden bg-black">
                {screen.logo && (
                    <img
                        src={screen.logo}
                        alt="Logo"
                        draggable={false}
                        className="pointer-events-none absolute top-6 right-6 z-10 h-12 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] md:top-10 md:right-10 md:h-20"
                    />
                )}

                {slides.length === 0 ? (
                    <div className="grid h-full place-items-center">
                        <p className="text-lg font-semibold text-white/60">
                            No slides yet.
                        </p>
                    </div>
                ) : screen.layout === 'grid' ? (
                    <BoardGrid
                        slides={slides}
                        rotationSeconds={screen.rotation_seconds}
                        showPrices={screen.display_prices}
                    />
                ) : screen.layout === 'showcase' ? (
                    <BoardShowcase
                        slides={slides}
                        rotationSeconds={screen.rotation_seconds}
                        showPrices={screen.display_prices}
                    />
                ) : (
                    <BoardSlider
                        slides={slides}
                        rotationSeconds={screen.rotation_seconds}
                        showPrices={screen.display_prices}
                        layout={screen.layout}
                    />
                )}
            </main>
        </>
    );
}
