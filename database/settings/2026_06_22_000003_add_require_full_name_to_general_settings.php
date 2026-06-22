<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.require_full_name', false);
    }

    public function down(): void
    {
        $this->migrator->delete('general.require_full_name');
    }
};
