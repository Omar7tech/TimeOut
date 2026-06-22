<?php

namespace App\Enums;

use Filament\Support\Contracts\HasDescription;
use Filament\Support\Contracts\HasLabel;

enum BannerMode: string implements HasDescription, HasLabel
{
    /**
     * A single banner sentence shown every day.
     */
    case FIXED = 'fixed';

    /**
     * A different banner sentence per weekday, picked automatically.
     */
    case SCHEDULED = 'scheduled';

    public function getLabel(): string
    {
        return match ($this) {
            self::FIXED => 'Fixed - ثابت',
            self::SCHEDULED => 'Scheduled by day - مجدول حسب اليوم',
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::FIXED => 'Show the same sentence every day. - أظهر نفس الجملة كل يوم.',
            self::SCHEDULED => 'Show a different sentence for each day of the week. - أظهر جملة مختلفة لكل يوم من أيام الأسبوع.',
        };
    }
}
