<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum SocialPlatform: string implements HasLabel
{
    case INSTAGRAM = 'instagram';
    case FACEBOOK = 'facebook';
    case WHATSAPP = 'whatsapp';

    public function getLabel(): string
    {
        return match ($this) {
            self::INSTAGRAM => 'Instagram - انستغرام',
            self::FACEBOOK => 'Facebook - فيسبوك',
            self::WHATSAPP => 'WhatsApp - واتساب',
        };
    }

    /**
     * The platform's plain English name, used for the storefront footer.
     */
    public function getName(): string
    {
        return match ($this) {
            self::INSTAGRAM => 'Instagram',
            self::FACEBOOK => 'Facebook',
            self::WHATSAPP => 'WhatsApp',
        };
    }

    /**
     * The public path to this platform's icon, served from `public/social-icons`.
     */
    public function getIconPath(): string
    {
        return "/social-icons/{$this->value}.svg";
    }
}
