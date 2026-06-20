<?php

namespace App\Settings;

use App\Enums\PriceDisplay;
use Spatie\LaravelSettings\Settings;
use Spatie\LaravelSettings\SettingsCasts\EnumCast;

class GeneralSettings extends Settings
{
    /**
     * Whether the shop is currently open. Drives the storefront logo (open vs.
     * closed variant) and can gate ordering.
     */
    public bool $is_open;

    public ?float $lbp_exchange_rate;

    public bool $show_lbp_prices;

    /**
     * Which currency the storefront prices are displayed in.
     */
    public PriceDisplay $price_display;

    public static function group(): string
    {
        return 'general';
    }

    /**
     * @return array<string, EnumCast>
     */
    public static function casts(): array
    {
        return [
            'price_display' => new EnumCast(PriceDisplay::class),
        ];
    }
}
