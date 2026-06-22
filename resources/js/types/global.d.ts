import type { Auth } from '@/types/auth';
import type { Banner } from '@/types/banner';
import type { Pricing } from '@/types/pricing';
import type { Shop } from '@/types/shop';
import type { Social } from '@/types/social';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            banner: Banner;
            pricing: Pricing;
            shop: Shop;
            socials: Social[];
            onlineOrderingActive: boolean;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
