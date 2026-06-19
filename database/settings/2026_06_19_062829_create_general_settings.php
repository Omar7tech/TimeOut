<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.show_lbp_prices', true);
        $this->migrator->add('general.lbp_exchange_rate', 90000);
    }
};
