import { useEffect, useRef, useState } from 'react';

/**
 * Whether the element has scrolled into view yet. Fires once and stays true,
 * so whatever it starts plays a single time.
 */
export function useSeen<T extends Element>(
    threshold = 0.3,
): [React.RefObject<T | null>, boolean] {
    const ref = useRef<T>(null);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        const el = ref.current;

        if (!el || seen) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSeen(true);
                    observer.disconnect();
                }
            },
            { threshold },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [seen, threshold]);

    return [ref, seen];
}
