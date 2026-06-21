<?php

namespace App\Enums;

use BackedEnum;
use Filament\Support\Contracts\HasDescription;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

enum ShopStatusMode: string implements HasDescription, HasIcon, HasLabel
{
    /**
     * The shop's open/closed state is controlled by hand with a single toggle.
     */
    case MANUAL = 'manual';

    /**
     * The shop's open/closed state is derived from a weekly opening-hours schedule.
     */
    case AUTOMATIC = 'automatic';

    public function getLabel(): string
    {
        return match ($this) {
            self::MANUAL => 'Manual',
            self::AUTOMATIC => 'Automatic',
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::MANUAL => 'Flip a switch yourself to open or close the shop.',
            self::AUTOMATIC => 'Open and close the shop automatically based on a weekly schedule.',
        };
    }

    public function getIcon(): BackedEnum
    {
        return match ($this) {
            self::MANUAL => Heroicon::OutlinedHandRaised,
            self::AUTOMATIC => Heroicon::OutlinedClock,
        };
    }
}
