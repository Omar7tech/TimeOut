<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('board_slides', function (Blueprint $table) {
            // Only used for plain (non-product) slides: when on, the slide shows
            // only on the chosen weekdays. Product slides follow their product.
            $table->boolean('custom_schedule')->default(false)->after('text');
            // ISO weekdays (1 = Mon .. 7 = Sun) the slide is shown on.
            $table->json('available_days')->nullable()->after('custom_schedule');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('board_slides', function (Blueprint $table) {
            $table->dropColumn(['custom_schedule', 'available_days']);
        });
    }
};
