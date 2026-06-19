<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::query()->pluck('id');

        if ($categories->isEmpty()) {
            $categories = Category::factory()->count(10)->create()->pluck('id');
        }

        Product::factory()
            ->count(100)
            ->sequence(fn () => ['category_id' => $categories->random()])
            ->create();
    }
}
