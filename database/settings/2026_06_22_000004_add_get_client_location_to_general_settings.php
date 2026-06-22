<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.get_client_location', false);
    }

    public function down(): void
    {
        $this->migrator->delete('general.get_client_location');
    }
};
