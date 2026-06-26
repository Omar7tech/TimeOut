<?php

use App\Enums\MenuFilterDesign;
use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.menu_filter_design', MenuFilterDesign::PILLS->value);
    }

    public function down(): void
    {
        $this->migrator->delete('general.menu_filter_design');
    }
};
