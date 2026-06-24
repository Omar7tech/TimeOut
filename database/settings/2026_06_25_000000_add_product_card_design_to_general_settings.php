<?php

use App\Enums\ProductCardDesign;
use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.product_card_design', ProductCardDesign::CLASSIC->value);
    }

    public function down(): void
    {
        $this->migrator->delete('general.product_card_design');
    }
};
