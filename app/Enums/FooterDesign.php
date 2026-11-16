<?php

namespace App\Enums;

use BackedEnum;
use Filament\Support\Contracts\HasDescription;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

/**
 * The visual style of the footer at the bottom of the storefront menu.
 */
enum FooterDesign: string implements HasDescription, HasIcon, HasLabel
{
    /** The orange "Hungry?" card, an info panel and the full logo. */
    case CLASSIC = 'classic';

    /** A torn paper till receipt taped onto an orange slab. */
    case RECEIPT = 'receipt';

    public function getLabel(): string
    {
        return match ($this) {
            self::CLASSIC => 'Classic - كلاسيكي',
            self::RECEIPT => 'Receipt - فاتورة',
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::CLASSIC => 'An orange "Hungry?" card, the sections and socials, and the full logo. - بطاقة "جوعان؟" برتقالية، الأقسام والحسابات، والشعار كاملاً.',
            self::RECEIPT => 'A fun torn paper receipt on an orange background, listing the sections like order items. - فاتورة ورقية ممزقة على خلفية برتقالية، تعرض الأقسام كأنها طلبات.',
        };
    }

    public function getIcon(): BackedEnum
    {
        return match ($this) {
            self::CLASSIC => Heroicon::OutlinedRectangleStack,
            self::RECEIPT => Heroicon::OutlinedReceiptPercent,
        };
    }
}
