<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * The menu's categories exactly as the live Time Out Snack site has them,
     * in menu order, keyed by their live slug so existing links keep working.
     * Each one carries the add-ons the live site offers with it.
     *
     * @var array<string, array{title: string, addons: list<array{name: string, price: float|int}>}>
     */
    private const CATEGORIES = [
        'burgers' => ['title' => 'Burgers', 'addons' => []],
        'shaorma' => ['title' => 'شاورما', 'addons' => [['name' => 'Shawarma', 'price' => 250]]],
        'mndy' => ['title' => 'مندي', 'addons' => [['name' => 'ماندي', 'price' => 4]]],
        'frog' => ['title' => 'فروج', 'addons' => [['name' => 'فروج', 'price' => 11.3]]],
        'sndoysh' => ['title' => 'سندويش', 'addons' => []],
        'mshaoy' => ['title' => 'مشاوي', 'addons' => [['name' => 'بطاطا صحن', 'price' => 4]]],
        'plate' => ['title' => 'plate', 'addons' => []],
        'box' => ['title' => 'Box', 'addons' => []],
    ];

    /**
     * Create each category once. One that already exists is left alone, so
     * reseeding never undoes an edit made in the admin.
     */
    public function run(): void
    {
        foreach (array_keys(self::CATEGORIES) as $sortOrder => $slug) {
            $category = self::CATEGORIES[$slug];

            Category::query()->firstOrCreate(['slug' => $slug], [
                'title' => $category['title'],
                'is_active' => true,
                'sort_order' => $sortOrder,
                'addons' => $category['addons'],
            ]);
        }
    }
}
