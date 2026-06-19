<?php

namespace Database\Factories;

use App\Enums\OrderType;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dishes = [
            'Margherita Pizza', 'Pepperoni Pizza', 'Truffle Pasta', 'Beef Burger', 'Chicken Shawarma',
            'Caesar Salad', 'Grilled Salmon', 'Lamb Kofta', 'Falafel Wrap', 'Tabbouleh',
            'Hummus Plate', 'Mushroom Risotto', 'Club Sandwich', 'Fish & Chips', 'Spicy Ramen',
            'Pad Thai', 'Sushi Platter', 'BBQ Ribs', 'Caprese Salad', 'Mezze Platter',
            'Chocolate Lava Cake', 'Tiramisu', 'Cheesecake', 'Fresh Lemonade', 'Iced Latte',
        ];

        $price = $this->faker->randomElement([4.99, 7.50, 9.99, 12.00, 14.50, 18.99, 24.00, 32.50]);
        $hasDiscount = $this->faker->boolean(30);

        return [
            'category_id' => Category::factory(),
            'title' => $this->faker->randomElement($dishes).' '.$this->faker->numberBetween(1, 9999),
            'subtitle' => $this->faker->boolean(70) ? $this->faker->sentence(4) : null,
            'description' => $this->faker->boolean(80) ? $this->faker->paragraph() : null,
            'is_active' => $this->faker->boolean(85),
            'is_featured' => $this->faker->boolean(20),
            'sort_order' => $this->faker->numberBetween(0, 100),
            'price' => $price,
            'discount_price' => $hasDiscount ? round($price * $this->faker->randomFloat(2, 0.5, 0.9), 2) : null,
            'order_type' => $this->faker->randomElement(OrderType::cases()),
            'preparation_time' => $this->faker->boolean(60) ? $this->faker->numberBetween(5, 45) : null,
            'variants' => $this->faker->boolean(40) ? $this->variants() : null,
        ];
    }

    /**
     * Generate a small set of product variants.
     *
     * @return list<array{name: string, price: float, discount_price: float|null}>
     */
    protected function variants(): array
    {
        /** @var list<string> $names */
        $names = (array) Arr::random(['Small', 'Medium', 'Large', 'Family', 'Spicy', 'Extra cheese'], $this->faker->numberBetween(2, 3));

        $variants = [];

        foreach ($names as $name) {
            $price = (float) $this->faker->randomElement([3.00, 5.50, 8.00, 11.00, 15.00]);

            $variants[] = [
                'name' => (string) $name,
                'price' => $price,
                'discount_price' => $this->faker->boolean(25) ? round($price * 0.8, 2) : null,
            ];
        }

        return $variants;
    }

    /**
     * Indicate that the product is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes): array => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes): array => [
            'is_featured' => true,
        ]);
    }
}
