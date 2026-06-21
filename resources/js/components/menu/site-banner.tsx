import { usePage } from '@inertiajs/react';

/** Polka-dot texture layered over the banner's red fill, matching the filter pills. */
const dots =
    '[background-image:radial-gradient(rgba(255,255,255,0.22)_1.5px,transparent_1.5px)] [background-size:8px_8px]';

/**
 * Promotional strip shown above the header on the storefront. Driven by the
 * shared `banner` setting; renders nothing when disabled or empty.
 */
export function SiteBanner() {
    const { banner } = usePage().props;

    if (!banner?.show || !banner.text) {
        return null;
    }

    return (
        <div
            className={`border-b-2 border-black bg-brand-red text-white ${dots}`}
        >
            <p className="mx-auto max-w-[1400px] px-4 py-2 text-center text-sm font-extrabold tracking-wide uppercase md:px-10 md:text-base">
                {banner.text}
            </p>
        </div>
    );
}
