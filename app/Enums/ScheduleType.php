<?php

namespace App\Enums;

use BackedEnum;
use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

enum ScheduleType: string implements HasColor, HasIcon, HasLabel
{
    case RECURRING = 'recurring';
    case WINDOW = 'window';

    public function getLabel(): string
    {
        return match ($this) {
            self::RECURRING => 'Weekly (recurring)',
            self::WINDOW => 'Date window (one-off)',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::RECURRING => 'info',
            self::WINDOW => 'warning',
        };
    }

    public function getIcon(): BackedEnum
    {
        return match ($this) {
            self::RECURRING => Heroicon::ArrowPath,
            self::WINDOW => Heroicon::CalendarDays,
        };
    }
}
