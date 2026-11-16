<?php

use App\Enums\FooterDesign;
use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.footer_design', FooterDesign::CLASSIC->value);
    }

    public function down(): void
    {
        $this->migrator->delete('general.footer_design');
    }
};
