<?php

namespace Database\Factories;

use App\Enums\ScreenOrientation;
use App\Models\DisplayScreen;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<DisplayScreen>
 */
class DisplayScreenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = ucfirst($this->faker->words(2, true));

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.$this->faker->unique()->numberBetween(1, 99999),
            'orientation' => ScreenOrientation::LANDSCAPE,
            'rotation_seconds' => 6,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }

    /**
     * A screen mounted in portrait orientation.
     */
    public function portrait(): static
    {
        return $this->state(fn (): array => [
            'orientation' => ScreenOrientation::PORTRAIT,
        ]);
    }

    /**
     * A screen that is hidden from the displays.
     */
    public function inactive(): static
    {
        return $this->state(fn (): array => [
            'is_active' => false,
        ]);
    }
}
