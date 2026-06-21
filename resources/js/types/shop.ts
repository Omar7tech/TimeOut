/** How the shop's open/closed state is decided. Mirrors PHP `ShopStatusMode`. */
export type ShopStatusMode = 'manual' | 'automatic';

/** A single weekday's opening hours. `day` is JS-style (0 = Sunday). */
export type OpeningHours = {
    day: number;
    isClosed: boolean;
    opensAt: string;
    closesAt: string;
};

export type Shop = {
    /** Authoritative open/closed snapshot from the server for the initial render. */
    isOpen: boolean;
    /** Whether the state is driven manually or by the weekly schedule. */
    statusMode: ShopStatusMode;
    /** The manual switch value; only authoritative in `manual` mode. */
    isManuallyOpen: boolean;
    /** The weekly schedule; only authoritative in `automatic` mode. */
    openingHours: OpeningHours[];
};
