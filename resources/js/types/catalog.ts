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
    image: string | null;
    thumb: string | null;
};

export type Category = {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    products: Product[];
};
