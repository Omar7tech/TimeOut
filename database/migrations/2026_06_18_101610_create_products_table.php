<?php

use App\Enums\OrderType;
use App\Models\Category;
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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->unsignedMediumInteger('sort_order')->default(0);
            $table->decimal('price', 8, 2);
            $table->decimal('discount_price', 8, 2)->nullable();
            $table->string('order_type')->default(OrderType::BOTH->value);
            $table->unsignedSmallInteger('preparation_time')->nullable();

            // availability: when has_schedule is false the product is always
            // available; otherwise it is only available on the ISO weekdays
            // (1=Mon .. 7=Sun) listed in available_days.
            $table->boolean('has_schedule')->default(false);
            $table->json('available_days')->nullable();

            $table->json('variants')->nullable();
            $table->foreignIdFor(Category::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
