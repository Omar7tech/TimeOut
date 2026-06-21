import { usePage } from '@inertiajs/react';

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
        <div className="border-y-2 border-black bg-brand-yellow text-black">
            <p className="mx-auto max-w-[1400px] px-4 py-2 text-center text-sm font-extrabold tracking-wide uppercase md:px-10 md:text-base">
                {banner.text}
            </p>
        </div>
    );
}
