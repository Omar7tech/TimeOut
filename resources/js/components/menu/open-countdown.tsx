import { useEffect, useState } from 'react';
import {
    dayName,
    formatTime,
    isShopOpen,
    nextOpening,
    useShop,
} from '@/lib/shop';

/** Pad a number to two digits for the countdown blocks. */
function pad(value: number): string {
    return String(value).padStart(2, '0');
}

/** A friendly label for when the shop next opens, e.g. "Today" or "Saturday". */
function whenLabel(target: Date, now: Date): string {
    const days = Math.round(
        (new Date(target).setHours(0, 0, 0, 0) -
            new Date(now).setHours(0, 0, 0, 0)) /
            86_400_000,
    );

    if (days === 0) {
        return 'today';
    }

    if (days === 1) {
        return 'tomorrow';
    }

    return dayName(target.getDay());
}

/**
 * Live "we'll be open in…" countdown for the landing page. Renders only when the
 * shop runs on the automatic schedule and is currently closed, ticking down to
 * the next opening time and showing the day/time it reopens.
 */
export function OpenCountdown() {
    const shop = useShop();
    const [now, setNow] = useState(() => new Date());

    // Tick every second so the countdown stays live.
    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 1000);

        return () => window.clearInterval(timer);
    }, []);

    if (isShopOpen(shop, now)) {
        return null;
    }

    const target = nextOpening(shop, now);

    if (!target) {
        return null;
    }

    const remaining = Math.max(0, target.getTime() - now.getTime());
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const blocks = [
        ...(days > 0 ? [{ value: days, unit: 'Days' }] : []),
        { value: hours, unit: 'Hrs' },
        { value: minutes, unit: 'Min' },
        { value: seconds, unit: 'Sec' },
    ];

    return (
        <div className="mt-3 flex flex-col items-center gap-2">
            <span className="text-[11px] font-black tracking-widest text-brand-red uppercase">
                We'll be open in
            </span>

            <div className="flex items-center gap-1.5">
                {blocks.map((block, index) => (
                    <div key={block.unit} className="flex items-center gap-1.5">
                        <div className="flex min-w-11 flex-col items-center rounded-md border-2 border-black bg-card px-2 py-1 shadow-[3px_3px_0_0_#000]">
                            <span className="text-xl font-black tabular-nums">
                                {pad(block.value)}
                            </span>
                            <span className="text-[9px] font-extrabold tracking-widest text-muted-foreground uppercase">
                                {block.unit}
                            </span>
                        </div>
                        {index < blocks.length - 1 && (
                            <span className="text-lg font-black text-brand-red">
                                :
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <span className="text-xs font-bold text-muted-foreground">
                Opens {whenLabel(target, now)} at{' '}
                {formatTime(`${target.getHours()}:${pad(target.getMinutes())}`)}
            </span>
        </div>
    );
}
