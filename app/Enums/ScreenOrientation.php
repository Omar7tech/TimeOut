<?php

namespace App\Enums;

use BackedEnum;
use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

enum ScreenOrientation: string implements HasColor, HasIcon, HasLabel
{
    case LANDSCAPE = 'landscape';
    case PORTRAIT = 'portrait';

    public function getLabel(): string
    {
        return match ($this) {
            self::LANDSCAPE => 'Landscape',
            self::PORTRAIT => 'Portrait',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::LANDSCAPE => 'info',
            self::PORTRAIT => 'warning',
        };
    }

    public function getIcon(): BackedEnum
    {
        return match ($this) {
            self::LANDSCAPE => Heroicon::DeviceTablet,
            self::PORTRAIT => Heroicon::DevicePhoneMobile,
        };
    }
}
