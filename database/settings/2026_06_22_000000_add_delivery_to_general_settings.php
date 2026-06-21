<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.charge_delivery', false);
        $this->migrator->add('general.delivery_fee', 3.0);
    }

    public function down(): void
    {
        $this->migrator->delete('general.delivery_fee');
        $this->migrator->delete('general.charge_delivery');
    }
};
