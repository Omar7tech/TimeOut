<?php

use App\Settings\GeneralSettings;
use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.banner_mode', 'fixed');
        $this->migrator->add('general.banner_schedule', GeneralSettings::defaultBannerSchedule());

        // Seed the existing fixed sentence with a friendly default when empty.
        $this->migrator->update('general.banner_text', fn (?string $text): string => $text ?? 'Welcome To Time Out Snack');
    }

    public function down(): void
    {
        $this->migrator->delete('general.banner_schedule');
        $this->migrator->delete('general.banner_mode');
    }
};
