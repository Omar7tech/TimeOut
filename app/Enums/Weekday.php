<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

/**
 * Days of the week, numbered to match JavaScript's `Date.getDay()` (0 = Sunday)
 * so the storefront helpers can resolve "today" without remapping.
 */
enum Weekday: int implements HasLabel
{
    case SUNDAY = 0;
    case MONDAY = 1;
    case TUESDAY = 2;
    case WEDNESDAY = 3;
    case THURSDAY = 4;
    case FRIDAY = 5;
    case SATURDAY = 6;

    public function getLabel(): string
    {
        return match ($this) {
            self::SUNDAY => 'Sunday - الأحد',
            self::MONDAY => 'Monday - الإثنين',
            self::TUESDAY => 'Tuesday - الثلاثاء',
            self::WEDNESDAY => 'Wednesday - الأربعاء',
            self::THURSDAY => 'Thursday - الخميس',
            self::FRIDAY => 'Friday - الجمعة',
            self::SATURDAY => 'Saturday - السبت',
        };
    }
}
