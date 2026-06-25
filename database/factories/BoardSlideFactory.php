<?php

namespace Database\Factories;

use App\Models\BoardSlide;
use App\Models\DisplayScreen;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BoardSlide>
 */
class BoardSlideFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'display_screen_id' => DisplayScreen::factory(),
            'product_id' => null,
            'text' => null,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }

    /**
     * A slide that links to the given (or a new) product.
     */
    public function forProduct(?int $productId = null): static
    {
        return $this->state(fn (): array => [
            'product_id' => $productId ?? Product::factory(),
        ]);
    }
}
