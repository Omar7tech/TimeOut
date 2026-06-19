<?php

namespace Database\Factories;

use App\Enums\ScheduleType;
use App\Models\Product;
use App\Models\ProductSchedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductSchedule>
 */
class ProductScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(ScheduleType::cases());

        return [
            'product_id' => Product::factory(),
            'type' => $type,
            'day_of_week' => $type === ScheduleType::RECURRING ? $this->faker->numberBetween(1, 7) : null,
            'start_date' => $type === ScheduleType::WINDOW ? $this->faker->dateTimeBetween('-1 week', '+1 week') : null,
            'end_date' => $type === ScheduleType::WINDOW ? $this->faker->dateTimeBetween('+1 week', '+1 month') : null,
            'start_time' => $this->faker->boolean(70) ? $this->faker->time('H:i:s', '12:00:00') : null,
            'end_time' => $this->faker->boolean(70) ? $this->faker->time('H:i:s', '23:00:00') : null,
            'is_active' => $this->faker->boolean(85),
        ];
    }

    /**
     * Indicate a weekly recurring rule.
     */
    public function recurring(): static
    {
        return $this->state(fn (array $attributes): array => [
            'type' => ScheduleType::RECURRING,
            'day_of_week' => $this->faker->numberBetween(1, 7),
            'start_date' => null,
            'end_date' => null,
        ]);
    }

    /**
     * Indicate a one-off date window rule.
     */
    public function window(): static
    {
        return $this->state(fn (array $attributes): array => [
            'type' => ScheduleType::WINDOW,
            'day_of_week' => null,
            'start_date' => $this->faker->dateTimeBetween('-1 week', '+1 week'),
            'end_date' => $this->faker->dateTimeBetween('+1 week', '+1 month'),
        ]);
    }
}
