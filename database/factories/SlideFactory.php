<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Slide;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Slide>
 */
class SlideFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => null,
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
