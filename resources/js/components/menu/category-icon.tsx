import {
    Beef,
    CakeSlice,
    Coffee,
    Cookie,
    Croissant,
    CupSoda,
    Donut,
    Drumstick,
    EggFried,
    Flame,
    Hamburger,
    IceCreamCone,
    Pizza,
    Popcorn,
    Salad,
    Sandwich,
    Soup,
    UtensilsCrossed,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { createElement } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

/**
 * Words in a section's name (Arabic or English) mapped to the line icon drawn
 * when the section has no uploaded icon. Checked in order, so the more specific
 * words come first; a name matching nothing gets cutlery.
 */
const ICONS: [RegExp, LucideIcon][] = [
    [/شاورما|شاورمة|shawarma|wrap|لفائف/i, Flame],
    [/برغر|برجر|burger/i, Hamburger],
    [/بيتزا|منقوش|pizza|manak/i, Pizza],
    [/دجاج|فراريج|جوانح|chicken|wings/i, Drumstick],
    [/مشاوي|لحم|كباب|grill|bbq|meat|steak/i, Beef],
    [/سندويش|سندويتش|sandwich|sub|toast/i, Sandwich],
    [/فطور|بيض|breakfast|egg/i, EggFried],
    [/كرواسان|معجنات|pastr|croissant|bakery/i, Croissant],
    [/مقبلات|بطاطا|سناك|appetizer|starter|fries|snack|sides/i, Popcorn],
    [/سلطة|سلطات|salad/i, Salad],
    [/شوربة|soup/i, Soup],
    [/بوظة|آيس|ice ?cream|gelato/i, IceCreamCone],
    [/دونات|donut/i, Donut],
    [/كوكيز|بسكويت|cookie/i, Cookie],
    [/حلويات|حلو|dessert|sweet|cake|crepe|waffle/i, CakeSlice],
    [/قهوة|كافيه|coffee|cafe|espresso|hot drink/i, Coffee],
    [/مشروبات|عصير|عصائر|drink|beverage|juice|soda/i, CupSoda],
];

/** The line icon that best fits a section's name. */
export function iconForCategory(title: string): LucideIcon {
    return (
        ICONS.find(([pattern]) => pattern.test(title))?.[1] ?? UtensilsCrossed
    );
}

/** Paints an uploaded icon through a mask, so it takes the text colour. */
function maskOf(src: string): CSSProperties {
    const url = `url("${src}")`;

    return {
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
    };
}

interface CategoryIconProps {
    category: Pick<Category, 'title' | 'image'>;
    /** Size and colour of the glyph (it draws in `currentColor`). */
    className?: string;
}

/**
 * A section's icon. An icon uploaded from the dashboard (a single-colour glyph
 * on transparency) is painted through a mask in the current text colour, so
 * every icon matches the brand ink whatever colour it was exported in. With
 * no upload, a matching line icon is drawn instead.
 */
export function CategoryIcon({ category, className }: CategoryIconProps) {
    if (category.image) {
        return (
            <span
                aria-hidden
                style={maskOf(category.image)}
                className={cn('block shrink-0 bg-current', className)}
            />
        );
    }

    // Picked from a fixed table, never defined here, so createElement is safe.
    return createElement(iconForCategory(category.title), {
        'aria-hidden': true,
        className: cn('shrink-0', className),
        strokeWidth: 1.9,
    });
}
