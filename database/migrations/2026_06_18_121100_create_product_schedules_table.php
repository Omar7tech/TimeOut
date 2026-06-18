<?php

use App\Enums\ScheduleType;
use App\Models\Product;
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
        Schema::create('product_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Product::class)->constrained()->cascadeOnDelete();

            // recurring = weekly day-of-week rule, window = one-off date range
            $table->string('type')->default(ScheduleType::RECURRING->value);

            // recurring: 1 (Mon) .. 7 (Sun), ISO-8601
            $table->unsignedTinyInteger('day_of_week')->nullable();

            // window: calendar range (e.g. "next week")
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            // optional time-of-day window for either type; null = all day
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();

            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['product_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_schedules');
    }
};
