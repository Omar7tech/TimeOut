<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.online_ordering_active', true);
        $this->migrator->add('general.whatsapp_number', '+9613150099');
    }

    public function down(): void
    {
        $this->migrator->delete('general.whatsapp_number');
        $this->migrator->delete('general.online_ordering_active');
    }
};
