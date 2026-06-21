<?php

namespace App\Enums;

use BackedEnum;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

enum PriceDisplay: string implements HasIcon, HasLabel
{
    case USD = 'usd';
    case LBP = 'lbp';
    case BOTH = 'both';

    public function getLabel(): string
    {
        return match ($this) {
            self::USD => 'USD only - دولار فقط',
            self::LBP => 'LBP only - ليرة فقط',
            self::BOTH => 'Both (USD & LBP) - كلاهما (دولار وليرة)',
        };
    }

    public function getIcon(): BackedEnum
    {
        return match ($this) {
            self::USD => Heroicon::OutlinedBanknotes,
            self::LBP => Heroicon::OutlinedBanknotes,
            self::BOTH => Heroicon::OutlinedArrowsRightLeft,
        };
    }

    /**
     * Whether this display mode requires an LBP exchange rate.
     */
    public function needsLbpRate(): bool
    {
        return $this !== self::USD;
    }
}
