<?php

namespace App\Enums;

use BackedEnum;
use Filament\Support\Contracts\HasDescription;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

/**
 * The visual style of the day picker on the storefront's weekly schedule.
 */
enum ScheduleDayDesign: string implements HasDescription, HasIcon, HasLabel
{
    /** A calendar strip: all seven days in one bar with their date numbers. */
    case CALENDAR = 'calendar';

    /** One card per day with the day's name and how many dishes it has. */
    case CARDS = 'cards';

    /** A compact row of rounded chips with the day's name. */
    case CHIPS = 'chips';

    public function getLabel(): string
    {
        return match ($this) {
            self::CALENDAR => 'Calendar - تقويم',
            self::CARDS => 'Cards - بطاقات',
            self::CHIPS => 'Chips - أزرار',
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::CALENDAR => 'All seven days in one bar with their dates, like a calendar. - كل أيام الأسبوع في شريط واحد مع التاريخ، مثل التقويم.',
            self::CARDS => 'A card for each day with its name and number of dishes. - بطاقة لكل يوم مع اسمه وعدد الأطباق.',
            self::CHIPS => 'A compact row of rounded buttons with the day names. - صف مضغوط من الأزرار بأسماء الأيام.',
        };
    }

    public function getIcon(): BackedEnum
    {
        return match ($this) {
            self::CALENDAR => Heroicon::OutlinedCalendarDays,
            self::CARDS => Heroicon::OutlinedSquares2x2,
            self::CHIPS => Heroicon::OutlinedEllipsisHorizontalCircle,
        };
    }
}
