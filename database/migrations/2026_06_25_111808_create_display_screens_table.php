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
        Schema::create('display_screens', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            // How the physical TV is mounted; drives the layout the screen renders.
            $table->string('orientation')->default('landscape');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // The slides each board cycles through: a wide image with an optional
        // product link, mirroring the storefront slider but scoped to one screen.
        Schema::create('board_slides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('display_screen_id')->constrained()->cascadeOnDelete();
            // Optional product the slide links to; null means a plain image slide.
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('text')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('board_slides');
        Schema::dropIfExists('display_screens');
    }
};
