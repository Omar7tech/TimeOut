import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * Shape produced by Spatie's media library for a single conversion.
 * Build it on the backend from a Media model (see usage note below).
 */
export interface ResponsiveImageData {
    /** Fallback url for browsers without srcset support. */
    src: string;
    /** Comma-separated `url width` pairs, from `$media->getSrcset($conversion)`. */
    srcSet?: string;
    /** Intrinsic width of the original/conversion, prevents layout shift. */
    width?: number;
    /** Intrinsic height of the original/conversion, prevents layout shift. */
    height?: number;
    /** Tiny base64 SVG data-uri used as a blurred placeholder while loading. */
    placeholder?: string;
    /** Accessible alt text (defaults to the media name on the backend). */
    alt?: string;
}

type ResponsiveImageProps = Omit<
    React.ComponentProps<'img'>,
    'src' | 'srcSet' | 'width' | 'height' | 'sizes' | 'placeholder' | 'alt'
> & {
    media: ResponsiveImageData;
    /** Override the automatic `sizes`. Leave unset to auto-detect rendered width. */
    sizes?: string;
    /** Show the blurred placeholder behind the image until it loads. */
    withPlaceholder?: boolean;
    alt?: string;
};

/**
 * Mirrors Spatie's `responsiveImageWithPlaceholder` blade view:
 * the browser is told the image's real rendered width (as a `vw` value) so it
 * downloads the smallest matching `srcset` variant, and a tiny SVG shows while loading.
 */
export function ResponsiveImage({
    media,
    sizes,
    withPlaceholder = true,
    loading = 'lazy',
    className,
    style,
    onLoad,
    alt,
    ...props
}: ResponsiveImageProps) {
    const ref = useRef<HTMLImageElement>(null);
    const [autoSizes, setAutoSizes] = useState(sizes ?? '100vw');
    const [loaded, setLoaded] = useState(false);

    const recomputeSizes = useCallback(() => {
        if (sizes) {
            return;
        }

        const renderedWidth = ref.current?.getBoundingClientRect().width;

        if (!renderedWidth) {
            return;
        }

        setAutoSizes(`${Math.ceil((renderedWidth / window.innerWidth) * 100)}vw`);
    }, [sizes]);

    useEffect(() => {
        if (sizes) {
            return;
        }

        recomputeSizes();
        window.addEventListener('resize', recomputeSizes);

        return () => window.removeEventListener('resize', recomputeSizes);
    }, [recomputeSizes, sizes]);

    const showPlaceholder = withPlaceholder && Boolean(media.placeholder) && !loaded;

    return (
        <img
            ref={ref}
            data-slot="responsive-image"
            src={media.src}
            srcSet={media.srcSet}
            sizes={media.srcSet ? (sizes ?? autoSizes) : undefined}
            width={media.width}
            height={media.height}
            alt={alt ?? media.alt ?? ''}
            loading={loading}
            decoding="async"
            onLoad={(event) => {
                recomputeSizes();
                setLoaded(true);
                onLoad?.(event);
            }}
            className={cn('h-auto max-w-full', className)}
            style={{
                ...(showPlaceholder
                    ? {
                          backgroundImage: `url("${media.placeholder}")`,
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                      }
                    : undefined),
                ...style,
            }}
            {...props}
        />
    );
}
