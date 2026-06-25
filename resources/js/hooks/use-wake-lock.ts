import { useEffect } from 'react';

/**
 * Keeps the screen awake while the component is mounted using the Screen Wake
 * Lock API — intended for always-on displays like the in-store Menu Board so the
 * TV never dims or sleeps.
 *
 * The lock is automatically released by the browser when the tab is hidden (e.g.
 * switching apps), so it is re-acquired whenever the page becomes visible again.
 * Requires a secure context (HTTPS); silently does nothing where unsupported.
 */
export function useWakeLock(enabled = true): void {
    useEffect(() => {
        if (!enabled || !('wakeLock' in navigator)) {
            return;
        }

        let sentinel: WakeLockSentinel | null = null;
        let released = false;

        const request = async (): Promise<void> => {
            try {
                sentinel = await navigator.wakeLock.request('screen');
            } catch {
                // Denied (e.g. tab not visible, low battery); retry on next
                // visibility change.
            }
        };

        const handleVisibility = (): void => {
            if (document.visibilityState === 'visible' && !released) {
                void request();
            }
        };

        void request();
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            released = true;
            document.removeEventListener('visibilitychange', handleVisibility);
            void sentinel?.release();
        };
    }, [enabled]);
}
