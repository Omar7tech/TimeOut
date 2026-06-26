import { usePoll } from '@inertiajs/react';

/**
 * Periodically reloads the Menu Board so an always-on TV picks up new slides and
 * prices on its own, without anyone touching it. Pass the interval in minutes, or
 * null to disable.
 *
 * Built on Inertia's `usePoll`, which does a partial reload (no full navigation),
 * stops automatically on unmount, and throttles while the tab is backgrounded.
 */
export function useAutoRefresh(minutes: number | null): void {
    const enabled = minutes !== null && minutes > 0;

    usePoll(
        // usePoll requires a positive interval even while stopped; the dummy is
        // never used because autoStart is false when disabled.
        enabled ? minutes * 60 * 1000 : 60_000,
        {},
        { autoStart: enabled },
    );
}
