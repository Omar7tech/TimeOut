import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

/** Round brutalist button that flips between light and dark themes. */
export function ThemeToggle() {
    const { theme, toggle } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex size-11 items-center justify-center rounded-full border-2 border-black bg-card text-card-foreground shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-9"
        >
            {isDark ? <Sun className="size-5.5 sm:size-5" /> : <Moon className="size-5.5 sm:size-5" />}
        </button>
    );
}
