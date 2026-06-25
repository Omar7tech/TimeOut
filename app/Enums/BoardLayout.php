<?php

namespace App\Enums;

use BackedEnum;
use Filament\Support\Contracts\HasDescription;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

/**
 * The visual layout a Menu Board uses to present each slide on the TV.
 */
enum BoardLayout: string implements HasDescription, HasIcon, HasLabel
{
    /** The default: full-bleed image with details over a bottom gradient. */
    case SPOTLIGHT = 'spotlight';

    /** Image on one side, a solid details panel on the other. */
    case SPLIT = 'split';

    /** Full-bleed image with the details in a solid centered bottom bar. */
    case BANNER = 'banner';

    public function getLabel(): string
    {
        return match ($this) {
            self::SPOTLIGHT => 'Spotlight',
            self::SPLIT => 'Split',
            self::BANNER => 'Banner',
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::SPOTLIGHT => 'Full-screen image with the details over a soft gradient at the bottom.',
            self::SPLIT => 'Image on one half, the product details on a solid panel beside it.',
            self::BANNER => 'Full-screen image with the details centered in a solid bar along the bottom.',
        };
    }

    public function getIcon(): BackedEnum
    {
        return match ($this) {
            self::SPOTLIGHT => Heroicon::OutlinedSparkles,
            self::SPLIT => Heroicon::OutlinedViewColumns,
            self::BANNER => Heroicon::OutlinedRectangleGroup,
        };
    }
}
