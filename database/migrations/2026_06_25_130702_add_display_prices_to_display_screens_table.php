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
            // When true, product slides show their prices; when false, prices
            // are hidden (e.g. a board used purely for promotion).
            $table->boolean('display_prices')->default(true)->after('rotation_seconds');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('display_screens', function (Blueprint $table) {
            $table->dropColumn('display_prices');
        });
    }
};
