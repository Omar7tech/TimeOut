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
    /** The default: words with a tilted orange sticker sliding under the chosen one. */
    case PILLS = 'pills';

    /** Words with a thick orange underline sliding under the chosen one. */
    case TABS = 'tabs';

    /** Big faded words; the chosen one in solid orange. */
    case TYPE = 'type';

    /** Soft rounded chips that wrap onto multiple lines; mobile friendly. */
    case CHIPS = 'chips';

    /** A compact dropdown of categories beside quick Today/Schedule buttons. */
    case DROPDOWN = 'dropdown';

    public function getLabel(): string
    {
        return match ($this) {
            self::PILLS => 'Sticker - ملصق',
            self::TABS => 'Tabs - تبويبات',
            self::TYPE => 'Big type - خط عريض',
            self::CHIPS => 'Chips - وسوم',
            self::DROPDOWN => 'Dropdown - قائمة منسدلة',
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::PILLS => 'Words in a scrolling row with an orange sticker that slides to the chosen one. - كلمات في صف متحرك مع ملصق برتقالي ينتقل إلى المختار.',
            self::TABS => 'Words on a line with an orange underline that slides to the chosen one. - كلمات على خط مع خط برتقالي ينتقل تحت المختار.',
            self::TYPE => 'Big bold words, faded back; the chosen one in orange. Like a poster. - كلمات كبيرة باهتة، والمختارة بالبرتقالي. جريئة مثل الملصق.',
            self::CHIPS => 'Rounded chips that wrap onto several lines; nothing scrolls sideways. - وسوم تلتفّ على عدّة أسطر بدون تمرير جانبي.',
            self::DROPDOWN => 'One button that opens a list of every section. Saves the most space. - زر واحد يفتح قائمة بكل الأقسام. الأكثر توفيراً للمساحة.',
        };
    }

    public function getIcon(): BackedEnum
    {
        return match ($this) {
            self::PILLS => Heroicon::OutlinedRectangleGroup,
            self::TABS => Heroicon::OutlinedMinus,
            self::TYPE => Heroicon::OutlinedLanguage,
            self::CHIPS => Heroicon::OutlinedSparkles,
            self::DROPDOWN => Heroicon::OutlinedChevronDown,
        };
    }
}
