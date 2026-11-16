<?php

use App\Enums\CategoryCardDesign;
use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.category_card_design', CategoryCardDesign::SLAB->value);
    }

    public function down(): void
    {
        $this->migrator->delete('general.category_card_design');
    }
};
