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
        Schema::table('display_screens', function (Blueprint $table) {
            // When on, the main board reloads itself on an interval so it picks
            // up new slides and prices without anyone touching the TV.
            $table->boolean('auto_refresh')->default(false)->after('show_logo');
            $table->unsignedInteger('auto_refresh_minutes')->default(15)->after('auto_refresh');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('display_screens', function (Blueprint $table) {
            $table->dropColumn(['auto_refresh', 'auto_refresh_minutes']);
        });
    }
};
