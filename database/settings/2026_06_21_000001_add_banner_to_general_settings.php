<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.show_banner', false);
        $this->migrator->add('general.banner_text', null);
    }

    public function down(): void
    {
        $this->migrator->delete('general.banner_text');
        $this->migrator->delete('general.show_banner');
    }
};
