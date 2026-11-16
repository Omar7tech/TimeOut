<?php

namespace Database\Seeders;

use App\Enums\OrderType;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * The menu's products exactly as the live Time Out Snack site has them, in
     * menu order. `category` is the category's slug, `variants` maps each size
     * to its USD price in the order the menu shows them, and `days` lists the
     * ISO weekdays (1 = Monday … 7 = Sunday) a scheduled dish is served on; a
     * product without `days` is always available.
     *
     * @var list<array{slug: string, title: string, category: string, price: float|int, description?: string, variants?: array<string, float|int>, days?: list<int>, prep?: int, featured?: bool, spicy?: bool, active?: bool}>
     */
    private const PRODUCTS = [
        ['slug' => 'mndy-o-frog', 'title' => 'مندي و فروج', 'category' => 'mndy', 'price' => 17, 'variants' => ['نص فروج' => 8.88, 'فروج' => 17.77], 'days' => [1, 4]],
        ['slug' => 'mndy-o-shaorma-dgag', 'title' => 'مندي و شاورما دجاج', 'category' => 'mndy', 'price' => 7.22, 'days' => [1, 4], 'prep' => 10],
        ['slug' => 'shaorma-dgag', 'title' => 'شاورما دجاج', 'category' => 'shaorma', 'price' => 2.8, 'description' => 'بطاطا كبيس توم', 'variants' => ['صغير' => 2.77, 'كبير' => 3.88], 'days' => [1, 3, 6], 'prep' => 5],
        ['slug' => 'frog-aaalghaz', 'title' => 'فروج عالغاز', 'category' => 'frog', 'price' => 11.3, 'variants' => ['فروج' => 11.11, 'نصف فروج' => 6.66], 'days' => [1, 2, 3, 4, 5, 6, 7], 'prep' => 5],
        ['slug' => 'shaorma-lhm-aagl', 'title' => 'شاورما لحم عجل', 'category' => 'shaorma', 'price' => 3.37, 'variants' => ['صغير' => 3.33, 'كبير' => 5.55], 'days' => [2, 4]],
        ['slug' => 'mndy-o-shaorma-lhm-ghnm', 'title' => 'مندي و شاورما لحمة غنم', 'category' => 'mndy', 'price' => 8, 'days' => [4], 'prep' => 10],
        ['slug' => 'taook', 'title' => 'طاووق', 'category' => 'sndoysh', 'price' => 5.55, 'days' => [2, 3, 4, 5, 6, 7], 'prep' => 10],
        ['slug' => 'sndoysh-shkf', 'title' => 'سندويش شقف', 'category' => 'mshaoy', 'price' => 6.66, 'days' => [2, 3, 4, 5, 6, 7], 'prep' => 10],
        ['slug' => 'dgag-mshoy', 'title' => 'دجاج مشوي', 'category' => 'mshaoy', 'price' => 5, 'prep' => 10],
        ['slug' => 'frnsysko', 'title' => 'فرنسيسكو', 'category' => 'sndoysh', 'price' => 5.55, 'days' => [2, 3, 4, 5, 6, 7], 'prep' => 10],
        ['slug' => 'tshykn-sab', 'title' => 'تشيكن ساب', 'category' => 'sndoysh', 'price' => 5.55, 'days' => [2, 3, 4, 5, 6, 7], 'prep' => 10],
        ['slug' => 'sbysy', 'title' => 'سبيسي', 'category' => 'sndoysh', 'price' => 6.66, 'days' => [2, 3, 4, 5, 6, 7], 'prep' => 10, 'spicy' => true],
        ['slug' => 'krsby', 'title' => 'كرسبي', 'category' => 'plate', 'price' => 11.11, 'variants' => ['كرسبي صغير' => 5.6, 'كرسبي كبير' => 6.75], 'days' => [2, 3, 4, 5, 6, 7], 'prep' => 15],
        ['slug' => 'kft', 'title' => 'كفتة', 'category' => 'mshaoy', 'price' => 5.55, 'days' => [2, 3, 4, 5, 6, 7], 'prep' => 10],
        ['slug' => 'kbab', 'title' => 'كباب', 'category' => 'mshaoy', 'price' => 5.55, 'days' => [2, 3, 4, 5, 6, 7]],
        ['slug' => 'aorfly', 'title' => 'اورفلي', 'category' => 'mshaoy', 'price' => 5.55, 'days' => [2, 3, 4, 5, 6, 7], 'prep' => 10],
        ['slug' => 'fahyta', 'title' => 'فاهيتا', 'category' => 'sndoysh', 'price' => 5.55, 'days' => [2, 3, 4, 5, 6, 7], 'prep' => 10],
        ['slug' => 'fyly-styk', 'title' => 'فيلي ستيك', 'category' => 'sndoysh', 'price' => 7.22, 'days' => [2, 3, 4, 5, 6, 7], 'prep' => 10],
        ['slug' => 'shaorma-smk', 'title' => 'شاورما سمك', 'category' => 'shaorma', 'price' => 3.9, 'days' => [3, 5], 'active' => false],
        ['slug' => 'rosto-lhm', 'title' => 'روستو لحمة', 'category' => 'sndoysh', 'price' => 5.55, 'days' => [3, 7], 'prep' => 10, 'featured' => true],
        ['slug' => 'shaorma-lhmh-ghnm', 'title' => 'شاورما لحمه غنم', 'category' => 'shaorma', 'price' => 4.5, 'variants' => ['صغير' => 4.44, 'كبير' => 7.22], 'days' => [4], 'featured' => true],
        ['slug' => 'crispy-box', 'title' => 'Crispy box', 'category' => 'box', 'price' => 11.11, 'days' => [2, 3, 4, 5, 6, 7], 'prep' => 15, 'featured' => true],
    ];

    /**
     * Create each product once, keyed by its live slug. One that already
     * exists is left alone, so reseeding never undoes an edit made in the
     * admin.
     */
    public function run(): void
    {
        $categories = Category::query()->pluck('id', 'slug');

        foreach (self::PRODUCTS as $sortOrder => $product) {
            $categoryId = $categories[$product['category']] ?? null;

            if ($categoryId === null) {
                $this->command?->warn("No category [{$product['category']}] for product [{$product['slug']}].");

                continue;
            }

            $variants = [];

            foreach ($product['variants'] ?? [] as $name => $price) {
                $variants[] = ['name' => $name, 'price' => $price, 'discount_price' => null];
            }

            Product::query()->firstOrCreate(['slug' => $product['slug']], [
                'category_id' => $categoryId,
                'title' => $product['title'],
                'description' => $product['description'] ?? null,
                'price' => $product['price'],
                'discount_price' => null,
                'variants' => $variants === [] ? null : $variants,
                'is_active' => $product['active'] ?? true,
                'is_featured' => $product['featured'] ?? false,
                'is_spicy' => $product['spicy'] ?? false,
                'is_vegan' => false,
                'sort_order' => $sortOrder,
                'order_type' => OrderType::BOTH,
                'preparation_time' => $product['prep'] ?? null,
                'has_schedule' => isset($product['days']),
                'available_days' => $product['days'] ?? null,
            ]);
        }
    }
}
