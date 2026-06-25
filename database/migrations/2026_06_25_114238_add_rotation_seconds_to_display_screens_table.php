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
            // Seconds each slide stays on screen before auto-advancing.
            $table->unsignedInteger('rotation_seconds')->default(6)->after('orientation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('display_screens', function (Blueprint $table) {
            $table->dropColumn('rotation_seconds');
        });
    }
};
