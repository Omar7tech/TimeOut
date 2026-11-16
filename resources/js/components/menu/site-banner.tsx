import { usePage } from '@inertiajs/react';
import { Fragment } from 'react';

/** A small sunburst glyph, the logo's rays, used between ticker repeats. */
function Burst() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.6}
            strokeLinecap="round"
        >
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        </svg>
    );
}

/**
 * The promotional strip above the header, run as a yellow ticker like the
 * crawl on a shopfront sign. The text repeats enough to fill any width and the
 * track loops seamlessly; under reduced motion it simply rests. Driven by the
 * shared `banner` setting; renders nothing when disabled or empty.
 */
export function SiteBanner() {
    const { banner } = usePage().props;

    if (!banner?.show || !banner.text) {
        return null;
    }

    const run = Array.from({ length: 6 }, (_, index) => (
        <Fragment key={index}>
            <span dir="auto" className="whitespace-nowrap">
                {banner.text}
            </span>
            <Burst />
        </Fragment>
    ));

    return (
        <div className="relative overflow-hidden bg-brand-yellow text-black">
            <p className="sr-only">{banner.text}</p>
            <div
                aria-hidden
                className="flex w-max animate-ticker items-center gap-6 py-2 pr-6 text-sm font-bold"
            >
                {run}
                {run}
            </div>
        </div>
    );
}
