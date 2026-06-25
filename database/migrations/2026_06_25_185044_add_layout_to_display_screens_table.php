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
            // How each slide is presented on the TV (spotlight / split / banner).
            $table->string('layout')->default('spotlight')->after('orientation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('display_screens', function (Blueprint $table) {
            $table->dropColumn('layout');
        });
    }
};
