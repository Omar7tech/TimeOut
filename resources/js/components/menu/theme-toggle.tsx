import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

/** Round button that flips between the night and daylight themes. */
export function ThemeToggle() {
    const { theme, toggle } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex size-11 items-center justify-center rounded-full text-foreground ring-1 ring-border transition-[background-color,scale] duration-200 hover:bg-muted active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
            {isDark ? (
                <Sun className="size-5" strokeWidth={2.2} />
            ) : (
                <Moon className="size-5" strokeWidth={2.2} />
            )}
        </button>
    );
}
