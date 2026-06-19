<?php

use App\Enums\PriceDisplay;
use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.price_display', PriceDisplay::USD->value);
    }

    public function down(): void
    {
        $this->migrator->delete('general.price_display');
    }
};
