import { useEffect, useState } from 'react';
import {
    dayName,
    formatTime,
    isShopOpen,
    nextOpening,
    useShop,
} from '@/lib/shop';
import { cn } from '@/lib/utils';

/** Pad a number to two digits for the clock. */
function pad(value: number): string {
    return String(value).padStart(2, '0');
}

/** A friendly label for when the shop next opens, e.g. "today" or "Saturday". */
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

function Segment({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-3xl leading-none font-black tabular-nums md:text-4xl">
                {pad(value)}
            </span>
            <span className="mt-1 text-[9px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase">
                {label}
            </span>
        </div>
    );
}

function Colon() {
    return (
        <span className="-mt-3 text-2xl font-black text-brand-red md:text-3xl">
            :
        </span>
    );
}

/**
 * Live "opens in…" clock. Renders only when the shop runs on the automatic
 * schedule and is currently closed, ticking down to the next opening time.
 * Pass `className` to override the default landing-page container styling.
 */
export function OpenCountdown({ className }: { className?: string }) {
    const shop = useShop();
    const [now, setNow] = useState(() => new Date());

    // Tick every second so the clock stays live.
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

    const totalSeconds = Math.floor(
        Math.max(0, target.getTime() - now.getTime()) / 1000,
    );
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return (
        <div
            className={cn(
                'flex flex-col items-center gap-2',
                className ??
                    'mt-4 border-t-2 border-dashed border-black/15 pt-4',
            )}
        >
            <p className="text-[11px] font-black tracking-widest text-brand-red uppercase">
                Opens {whenLabel(target, now)} ·{' '}
                {formatTime(`${target.getHours()}:${pad(target.getMinutes())}`)}
            </p>

            <div className="flex items-start justify-center gap-2">
                {days > 0 && (
                    <>
                        <Segment value={days} label="Days" />
                        <Colon />
                    </>
                )}
                <Segment value={hours} label="Hrs" />
                <Colon />
                <Segment value={minutes} label="Min" />
                <Colon />
                <Segment value={seconds} label="Sec" />
            </div>
        </div>
    );
}
