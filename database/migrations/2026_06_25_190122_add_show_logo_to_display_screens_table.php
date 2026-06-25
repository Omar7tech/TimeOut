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
            // When on, the restaurant logo is overlaid on the board.
            $table->boolean('show_logo')->default(true)->after('display_prices');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('display_screens', function (Blueprint $table) {
            $table->dropColumn('show_logo');
        });
    }
};
