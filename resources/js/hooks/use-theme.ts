import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

function getInitialTheme(): Theme {
    if (typeof document === 'undefined') {
        return 'dark';
    }

    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Light/dark theme toggle. Defaults to dark, syncs the `dark` class on the
 * document root, and persists the choice to localStorage.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');

        try {
            window.localStorage.setItem('theme', theme);
        } catch {
            // Ignore storage failures.
        }
    }, [theme]);

    const toggle = (): void => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

    return { theme, toggle };
}
