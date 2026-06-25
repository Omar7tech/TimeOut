<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Make slides shareable: instead of belonging to one board, a slide joins
     * many boards through a pivot that carries each board's own ordering.
     */
    public function up(): void
    {
        Schema::create('board_slide_display_screen', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_slide_id')->constrained()->cascadeOnDelete();
            $table->foreignId('display_screen_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->unique(['board_slide_id', 'display_screen_id'], 'board_slide_screen_unique');
        });

        Schema::table('board_slides', function (Blueprint $table) {
            $table->dropConstrainedForeignId('display_screen_id');
            $table->dropColumn('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('board_slides', function (Blueprint $table) {
            $table->foreignId('display_screen_id')->nullable()->constrained()->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
        });

        Schema::dropIfExists('board_slide_display_screen');
    }
};
