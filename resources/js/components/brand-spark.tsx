import { cn } from '@/lib/utils';

/**
 * The logo's sunburst as a small mark: a fan of rounded rays breaking out of
 * the upper right, the way they burst off the "Out" in the logo. Used in front
 * of section labels and titles. It draws in `currentColor`; the default is the
 * house orange.
 */
export function BrandSpark({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 32 32"
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            className={cn('size-5 shrink-0 text-brand-red', className)}
        >
            <circle cx="9" cy="23" r="4.5" fill="currentColor" stroke="none" />
            <g strokeWidth={3}>
                <path d="M9 12.5V4.5" />
                <path d="M15.5 15.2 21.2 9.5" />
                <path d="M18.8 22H27" />
                <path d="M17.4 27.6 22.4 30" opacity={0.55} />
                <path d="M3.4 14.2 1.6 9.5" opacity={0.55} />
            </g>
        </svg>
    );
}
