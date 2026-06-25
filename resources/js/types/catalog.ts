export type OrderType = 'dine_in' | 'takeaway' | 'both';

/** The visual layout used to render product cards on the storefront menu. */
export type ProductCardDesign = 'classic' | 'spotlight' | 'minimal';

/** The visual style a Menu Board uses to present each slide on the TV. */
export type BoardLayout = 'spotlight' | 'split' | 'banner';

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
    is_spicy: boolean;
    is_vegan: boolean;
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

/**
 * A storefront carousel slide. When `product` is set the slide is clickable and
 * opens that product's details; otherwise it's a plain decorative image.
 */
export type Slide = {
    id: number;
    /** Optional caption overlaid on the slide image. */
    text: string | null;
    image: string | null;
    product: Product | null;
    addons: CategoryAddon[] | null;
};

/** Products available on a single weekday. `day` is ISO (1 = Monday .. 7 = Sunday). */
export type ScheduleDay = {
    day: number;
    products: Product[];
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
