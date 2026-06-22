<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.show_whatsapp_badge', false);
        $this->migrator->add('general.whatsapp_badge_number', '+9613150099');
    }

    public function down(): void
    {
        $this->migrator->delete('general.whatsapp_badge_number');
        $this->migrator->delete('general.show_whatsapp_badge');
    }
};
