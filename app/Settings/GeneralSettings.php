<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class GeneralSettings extends Settings
{

    public ?float $lbp_exchange_rate;

    public bool $show_lbp_prices;

    public static function group(): string
    {
        return 'general';
    }
}
