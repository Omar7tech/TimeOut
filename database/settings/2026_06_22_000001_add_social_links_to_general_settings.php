<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.social_links', []);
    }

    public function down(): void
    {
        $this->migrator->delete('general.social_links');
    }
};
