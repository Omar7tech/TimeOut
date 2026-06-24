<?php

namespace App\Enums;

use BackedEnum;
use Filament\Support\Contracts\HasDescription;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

/**
 * The visual layout used to render product cards on the storefront menu.
 */
enum ProductCardDesign: string implements HasDescription, HasIcon, HasLabel
{
    /** The default compact card: thumbnail left, details right. */
    case CLASSIC = 'classic';

    /** A bold, image-forward poster card with the title over the image. */
    case SPOTLIGHT = 'spotlight';

    /** A flat, airy, minimalist card with refined typography. */
    case MINIMAL = 'minimal';

    public function getLabel(): string
    {
        return match ($this) {
            self::CLASSIC => 'Classic - كلاسيكي',
            self::SPOTLIGHT => 'Spotlight - بارز',
            self::MINIMAL => 'Minimal - بسيط',
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::CLASSIC => 'Compact card with a small thumbnail and details side by side. - بطاقة مدمجة بصورة صغيرة والتفاصيل بجانبها.',
            self::SPOTLIGHT => 'Bold poster card with a large image and the title over it. - بطاقة بارزة بصورة كبيرة والاسم فوقها.',
            self::MINIMAL => 'Clean, airy card with soft styling and refined type. - بطاقة أنيقة وواسعة بتصميم ناعم.',
        };
    }

    public function getIcon(): BackedEnum
    {
        return match ($this) {
            self::CLASSIC => Heroicon::OutlinedRectangleStack,
            self::SPOTLIGHT => Heroicon::OutlinedSparkles,
            self::MINIMAL => Heroicon::OutlinedBars3BottomLeft,
        };
    }
}
