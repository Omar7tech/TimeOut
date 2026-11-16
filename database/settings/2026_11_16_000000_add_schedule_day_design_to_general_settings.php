<?php

use App\Enums\ScheduleDayDesign;
use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.schedule_day_design', ScheduleDayDesign::CALENDAR->value);
    }

    public function down(): void
    {
        $this->migrator->delete('general.schedule_day_design');
    }
};
