import { Head } from '@inertiajs/react';
import { BoardSlider } from '@/components/menu/board-slider';
import type { Slide } from '@/types';

interface BoardProps {
    screen: {
        name: string;
        orientation: 'landscape' | 'portrait';
        /** Seconds each slide stays on screen before auto-advancing. */
        rotation_seconds: number;
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
    return (
        <>
            <Head title={`${screen.name} - Menu Board`} />

            <main className="h-screen w-screen overflow-hidden bg-black">
                {slides.length > 0 ? (
                    <BoardSlider
                        slides={slides}
                        rotationSeconds={screen.rotation_seconds}
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
