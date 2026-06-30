export type LocationResult = {
    latitude: number;
    longitude: number;
    /** Accuracy radius in meters — smaller is better. */
    accuracy: number;
};

type Options = {
    /** How long to keep refining before giving up, in ms. */
    timeoutMs?: number;
    /** Stop early once a reading is at least this accurate, in meters. */
    desiredAccuracyM?: number;
    /**
     * Reject the lookup when the best fix is coarser than this, in meters.
     * Guards against IP/Wi-Fi fallbacks (common on laptops with no GPS) that
     * report a position kilometres off — a useless pin is worse than none.
     */
    maxAccuracyM?: number;
};

/**
 * Resolve the most accurate position the device can provide.
 *
 * `getCurrentPosition` returns a single, first fix — on mobile that is often the
 * coarse Wi-Fi/IP estimate captured before GPS locks, which can land far away.
 * Instead we `watchPosition` for a few seconds (GPS refines over time), keep the
 * reading with the smallest accuracy radius, and resolve early once it is good
 * enough. The promise rejects only if no position is obtained at all.
 */
export function getBestLocation({
    timeoutMs = 12000,
    desiredAccuracyM = 50,
    maxAccuracyM = 1000,
}: Options = {}): Promise<LocationResult> {
    return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
            reject(new Error('Geolocation is not available.'));

            return;
        }

        let best: GeolocationPosition | null = null;
        let settled = false;

        const finish = (): void => {
            if (settled) {
                return;
            }

            settled = true;
            navigator.geolocation.clearWatch(watchId);
            window.clearTimeout(timer);

            // Reject a too-coarse fix (e.g. an IP-based estimate kilometres off)
            // so the caller can fall back to manual sharing instead of pinning
            // the wrong place.
            if (best && best.coords.accuracy <= maxAccuracyM) {
                resolve({
                    latitude: best.coords.latitude,
                    longitude: best.coords.longitude,
                    accuracy: best.coords.accuracy,
                });
            } else {
                reject(new Error('Could not determine an accurate location.'));
            }
        };

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                // Keep the most precise reading seen so far.
                if (!best || position.coords.accuracy < best.coords.accuracy) {
                    best = position;
                }

                if (best.coords.accuracy <= desiredAccuracyM) {
                    finish();
                }
            },
            (error) => {
                // Only fail outright if nothing usable has arrived yet.
                if (!best) {
                    settled = true;
                    navigator.geolocation.clearWatch(watchId);
                    window.clearTimeout(timer);
                    reject(error);
                }
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: timeoutMs },
        );

        // Stop refining after the window and send the best fix collected.
        const timer = window.setTimeout(finish, timeoutMs);
    });
}
