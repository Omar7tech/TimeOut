<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.show_product_schedule', false);
    }

    public function down(): void
    {
        $this->migrator->delete('general.show_product_schedule');
    }
};
