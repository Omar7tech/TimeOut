<?php

namespace App\Enums;

use BackedEnum;
use Filament\Support\Contracts\HasDescription;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

/**
 * The visual style used to render the category filter controls on the menu.
 */
enum MenuFilterDesign: string implements HasDescription, HasIcon, HasLabel
{
    /** The default: bold neo-brutalist pills with hard offset shadows. */
    case PILLS = 'pills';

    /** Soft rounded chips that wrap onto multiple lines; mobile friendly. */
    case CHIPS = 'chips';

    /** A compact dropdown of categories beside quick Today/Schedule buttons. */
    case DROPDOWN = 'dropdown';

    public function getLabel(): string
    {
        return match ($this) {
            self::PILLS => 'Pills - أزرار',
            self::CHIPS => 'Chips - وسوم',
            self::DROPDOWN => 'Dropdown - قائمة منسدلة',
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::PILLS => 'Bold buttons with hard shadows in a scrollable row. - أزرار بارزة بظلال واضحة في صف قابل للتمرير.',
            self::CHIPS => 'Soft rounded chips that wrap onto multiple lines; great on phones. - وسوم ناعمة تلتفّ على عدّة أسطر؛ مثالية على الهاتف.',
            self::DROPDOWN => 'A space-saving dropdown of categories with quick buttons. - قائمة منسدلة موفّرة للمساحة مع أزرار سريعة.',
        };
    }

    public function getIcon(): BackedEnum
    {
        return match ($this) {
            self::PILLS => Heroicon::OutlinedRectangleGroup,
            self::CHIPS => Heroicon::OutlinedSparkles,
            self::DROPDOWN => Heroicon::OutlinedChevronDown,
        };
    }
}
