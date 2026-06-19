export type OrderType = 'dine_in' | 'takeaway' | 'both';

export type ProductVariant = {
    name: string;
    price: number;
    discount_price: number | null;
};

export type Product = {
    id: number;
    title: string;
    slug: string;
    subtitle: string | null;
    description: string | null;
    price: number;
    discount_price: number | null;
    order_type: OrderType;
    preparation_time: number | null;
    is_featured: boolean;
    variants: ProductVariant[] | null;
    /** True when the product is scheduled and available on the current weekday. */
    available_today: boolean;
    image: string | null;
    thumb: string | null;
};

export type CategoryAddon = {
    name: string;
    price: number;
};

export type Category = {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    addons: CategoryAddon[] | null;
    /** Only present when the endpoint eager-loads products (e.g. the menu page). */
    products?: Product[];
};
