<?php

use App\Enums\ShopStatusMode;
use App\Settings\GeneralSettings;
use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.status_mode', ShopStatusMode::MANUAL->value);
        $this->migrator->add('general.opening_hours', GeneralSettings::defaultOpeningHours());
    }

    public function down(): void
    {
        $this->migrator->delete('general.opening_hours');
        $this->migrator->delete('general.status_mode');
    }
};
