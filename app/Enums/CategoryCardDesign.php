<?php

namespace App\Enums;

use BackedEnum;
use Filament\Support\Contracts\HasDescription;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

/**
 * The visual style of the section cards on the storefront menu's landing view.
 */
enum CategoryCardDesign: string implements HasDescription, HasIcon, HasLabel
{
    /** Solid orange cards with the icon on a tilted sticker in the corner. */
    case SLAB = 'slab';

    /** Calm cards with the icon centred in an orange circle. */
    case TILE = 'tile';

    /** Full-width rows: icon, name and an arrow. */
    case LIST = 'list';

    /** Round icon bubbles with the name under each. */
    case BUBBLES = 'bubbles';

    public function getLabel(): string
    {
        return match ($this) {
            self::SLAB => 'Slab - لوح',
            self::TILE => 'Tile - مربع',
            self::LIST => 'List - قائمة',
            self::BUBBLES => 'Bubbles - فقاعات',
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::SLAB => 'Bold orange cards with the icon on a tilted sticker. - بطاقات برتقالية بارزة مع الأيقونة على ملصق مائل.',
            self::TILE => 'Calm cards with the icon centred and the name under it. - بطاقات هادئة مع الأيقونة في الوسط والاسم تحتها.',
            self::LIST => 'Compact rows, one under the other. Good for long menus. - صفوف مضغوطة تحت بعضها، مناسبة للقوائم الطويلة.',
            self::BUBBLES => 'Round icon bubbles with the name under each, like stories. - فقاعات دائرية للأيقونات مع الاسم تحتها.',
        };
    }

    public function getIcon(): BackedEnum
    {
        return match ($this) {
            self::SLAB => Heroicon::OutlinedRectangleGroup,
            self::TILE => Heroicon::OutlinedSquares2x2,
            self::LIST => Heroicon::OutlinedQueueList,
            self::BUBBLES => Heroicon::OutlinedEllipsisHorizontalCircle,
        };
    }
}
