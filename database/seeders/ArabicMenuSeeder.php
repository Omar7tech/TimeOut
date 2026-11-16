<?php

namespace Database\Seeders;

use App\Enums\OrderType;
use App\Models\Category;
use App\Models\Product;
use App\Models\Slide;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

/**
 * A realistic Arabic demo menu for local development: Lebanese snack
 * categories, products with sizes, add-ons, schedules and carousel slides.
 *
 * Not called by DatabaseSeeder on purpose, so it never touches a live menu.
 * Run it explicitly: `php artisan db:seed --class=ArabicMenuSeeder`.
 */
class ArabicMenuSeeder extends Seeder
{
    /**
     * Food photographs for the demo, staged in storage/app/demo-photos
     * (git-ignored). Missing files are skipped, so the menu still seeds.
     *
     * @var array<string, string>
     */
    private const PHOTOS = [
        'shawarma-spread' => 'shawarma-spread.png',
        'shawarma-spit' => 'shawarma-spit.png',
        'roast-baguette' => 'roast-baguette.png',
        'chicken-wrap' => 'chicken-wrap.png',
        'paper-sandwich' => 'paper-sandwich.png',
        'chicken-sub' => 'chicken-sub.png',
        'waffle' => 'waffle.jpg',
    ];

    public function run(): void
    {
        $menu = $this->menu();

        foreach (array_values($menu) as $categoryIndex => $categoryData) {
            $category = Category::query()->create([
                'title' => $categoryData['title'],
                'subtitle' => $categoryData['subtitle'],
                'is_active' => true,
                'sort_order' => $categoryIndex,
                'addons' => $categoryData['addons'],
            ]);

            $this->attachIcon($category, $categoryData['icon'] ?? null);

            foreach ($categoryData['products'] as $productIndex => $productData) {
                $product = Product::query()->create([
                    'category_id' => $category->id,
                    'title' => $productData['title'],
                    'subtitle' => $productData['subtitle'] ?? null,
                    'description' => $productData['description'] ?? null,
                    'price' => $productData['price'],
                    'discount_price' => $productData['discount_price'] ?? null,
                    'variants' => $productData['variants'] ?? null,
                    'is_active' => true,
                    'is_featured' => $productData['featured'] ?? false,
                    'is_spicy' => $productData['spicy'] ?? false,
                    'is_vegan' => $productData['vegan'] ?? false,
                    'sort_order' => $productIndex,
                    'order_type' => OrderType::BOTH,
                    'preparation_time' => $productData['prep'] ?? null,
                    'has_schedule' => isset($productData['days']),
                    'available_days' => $productData['days'] ?? null,
                ]);

                $this->attachPhoto($product, $productData['photo'] ?? null);
            }
        }

        $this->seedSlides();
    }

    private function seedSlides(): void
    {
        $slides = [
            ['photo' => 'shawarma-spread', 'product' => 'شاورما دجاج عربي', 'text' => 'عرض الويك إند: صحن شاورما مع بطاطا مجاناً'],
            ['photo' => 'roast-baguette', 'product' => 'سندويش روستو', 'text' => null],
            ['photo' => 'shawarma-spit', 'product' => null, 'text' => 'شاورما على الفحم كل يوم من الساعة ١١ الصبح'],
            ['photo' => 'waffle', 'product' => 'وافل نوتيلا', 'text' => 'حلّي بعد الأكل'],
        ];

        foreach ($slides as $index => $slideData) {
            $slide = Slide::query()->create([
                'product_id' => $slideData['product'] === null
                    ? null
                    : Product::query()->where('title', $slideData['product'])->value('id'),
                'text' => $slideData['text'],
                'is_active' => true,
                'sort_order' => $index,
            ]);

            $this->attachPhoto($slide, $slideData['photo']);
        }
    }

    /**
     * Attach one of the demo category icons (single-colour glyphs on
     * transparency) staged in storage/app/demo-photos/icons.
     */
    private function attachIcon(Category $category, ?string $icon): void
    {
        $path = $icon === null ? null : storage_path('app/demo-photos/icons/'.$icon);

        if ($path === null || ! File::exists($path)) {
            return;
        }

        $category->addMedia($path)->preservingOriginal()->toMediaCollection('image');
    }

    /**
     * @param  Category|Product|Slide  $model
     */
    private function attachPhoto($model, ?string $photo): void
    {
        if ($photo === null) {
            return;
        }

        $path = storage_path('app/demo-photos/'.self::PHOTOS[$photo]);

        if (! File::exists($path)) {
            return;
        }

        $model->addMedia($path)->preservingOriginal()->toMediaCollection('image');
    }

    /**
     * @return list<array{title: string, subtitle: string|null, icon?: string, addons: list<array{name: string, price: float}>|null, products: list<array<string, mixed>>}>
     */
    private function menu(): array
    {
        $sizes = fn (float $small, float $large): array => [
            ['name' => 'عادي', 'price' => $small, 'discount_price' => null],
            ['name' => 'دبل', 'price' => $large, 'discount_price' => null],
        ];

        return [
            [
                'title' => 'شاورما',
                'subtitle' => 'على الفحم، كل يوم',
                'addons' => [
                    ['name' => 'ثوم زيادة', 'price' => 0.5],
                    ['name' => 'بطاطا داخل السندويش', 'price' => 1],
                    ['name' => 'جبنة موزاريلا', 'price' => 1.5],
                ],
                'products' => [
                    ['title' => 'شاورما دجاج عربي', 'subtitle' => 'مقطّعة مع بطاطا وكبيس', 'description' => 'خبز صاج محمّص، دجاج متبّل ٢٤ ساعة، ثوم، بطاطا مقلية، مخلل وكبيس. تنقسم ٦ قطع.', 'price' => 7, 'photo' => 'chicken-wrap', 'featured' => true, 'prep' => 10],
                    ['title' => 'سندويش شاورما دجاج', 'subtitle' => 'ثوم ومخلل', 'description' => 'رغيف لبناني، دجاج، صلصة ثوم، خيار مكبوس.', 'price' => 4, 'variants' => $sizes(4, 6.5), 'photo' => 'shawarma-spread', 'prep' => 5],
                    ['title' => 'سندويش شاورما لحمة', 'subtitle' => 'طحينة وبقدونس', 'description' => 'لحم غنم وبقر، بندورة، بصل بالسماق، بقدونس وطحينة.', 'price' => 5, 'variants' => $sizes(5, 8), 'photo' => 'shawarma-spit', 'prep' => 5],
                    ['title' => 'صحن شاورما مشكّل', 'subtitle' => 'دجاج ولحمة مع حمص', 'description' => 'نص دجاج نص لحمة، حمص، بطاطا، ثوم، طحينة وخبز.', 'price' => 12, 'discount_price' => 10, 'prep' => 15],
                    ['title' => 'شاورما سوري', 'subtitle' => 'ملفوفة بخبز رقيق', 'description' => 'Thin saj wrap, crisped on the grill, finished with pomegranate molasses.', 'price' => 6, 'spicy' => true, 'photo' => 'chicken-wrap', 'days' => [1, 4, 5, 6]],
                ],
            ],
            [
                'title' => 'Burgers',
                'subtitle' => 'لحمة طازة كل يوم',
                'addons' => [
                    ['name' => 'Cheddar slice', 'price' => 1],
                    ['name' => 'بيض', 'price' => 0.75],
                    ['name' => 'Jalapeños', 'price' => 0.5],
                ],
                'products' => [
                    ['title' => 'Time Out Burger', 'subtitle' => 'الطبقتين مع صلصتنا السرية', 'description' => 'Two 120g beef patties, aged cheddar, caramelised onions, lettuce and our secret Time Out sauce.', 'price' => 9.5, 'featured' => true, 'prep' => 15, 'variants' => [
                        ['name' => 'Single', 'price' => 7, 'discount_price' => null],
                        ['name' => 'Double', 'price' => 9.5, 'discount_price' => null],
                        ['name' => 'Triple', 'price' => 12, 'discount_price' => 11],
                    ]],
                    ['title' => 'Classic Burger', 'subtitle' => 'خس، بندورة، مخلل', 'description' => 'قطعة لحمة مشوية مع كاتشب وخردل.', 'price' => 6.5, 'prep' => 12],
                    ['title' => 'Zinger Burger', 'subtitle' => 'Crispy spicy chicken', 'description' => 'دجاج مقلي مقرمش، كول سلو، مايونيز حار.', 'price' => 7, 'spicy' => true, 'prep' => 12],
                    ['title' => 'Mushroom Swiss', 'description' => 'Grilled beef, sautéed mushrooms and melted Swiss cheese.', 'subtitle' => 'فطر وجبنة سويسرية', 'price' => 8.5, 'prep' => 15],
                ],
            ],
            [
                'title' => 'سندويشات',
                'subtitle' => 'خبز باغيت فرنسي',
                'addons' => [
                    ['name' => 'جبنة زيادة', 'price' => 1],
                    ['name' => 'Fries on the side', 'price' => 1.5],
                ],
                'products' => [
                    ['title' => 'سندويش روستو', 'subtitle' => 'لحم بقر مشوي ببطء', 'description' => 'Slow-roasted beef, honey mustard, rocca and Emmental on a fresh French baguette.', 'price' => 8, 'photo' => 'roast-baguette', 'featured' => true],
                    ['title' => 'Chicken Fajita', 'subtitle' => 'فليفلة وبصل وجبنة', 'description' => 'دجاج بالبهارات المكسيكية مع فليفلة ملوّنة وموزاريلا ذايبة.', 'price' => 6.5, 'photo' => 'chicken-sub', 'spicy' => true],
                    ['title' => 'سجق مقلي', 'subtitle' => 'بدبس الرمان', 'description' => 'سجق أرمني مقلي مع بندورة ودبس رمان.', 'price' => 5.5, 'photo' => 'paper-sandwich', 'spicy' => true],
                    ['title' => 'طاووق', 'subtitle' => 'ثوم وبطاطا', 'price' => 5, 'variants' => $sizes(5, 7.5)],
                    ['title' => 'فلافل', 'subtitle' => 'طحينة وخضرا', 'description' => 'أقراص فلافل طازة، بندورة، فجل، نعنع وطحينة.', 'price' => 3, 'vegan' => true],
                ],
            ],
            [
                'title' => 'Starters · مقبلات',
                'subtitle' => 'للمشاركة',
                'addons' => null,
                'products' => [
                    ['title' => 'French Fries', 'subtitle' => 'Crispy, sea salt', 'price' => 2.5, 'vegan' => true, 'variants' => [
                        ['name' => 'Medium', 'price' => 2.5, 'discount_price' => null],
                        ['name' => 'Large', 'price' => 3.5, 'discount_price' => null],
                    ]],
                    ['title' => 'بطاطا حرّة', 'subtitle' => 'كزبرة وثوم وحر', 'price' => 3.5, 'spicy' => true, 'vegan' => true],
                    ['title' => 'حمص بطحينة', 'price' => 3, 'vegan' => true],
                    ['title' => 'Mozzarella Sticks', 'subtitle' => '6 pcs · مع صلصة مارينارا', 'price' => 4.5],
                    ['title' => 'جوانح دجاج', 'subtitle' => 'بافلو أو باربكيو', 'price' => 6, 'spicy' => true, 'days' => [1, 3, 5]],
                ],
            ],
            [
                'title' => 'كريب',
                'subtitle' => 'رقيق ومحشي عالطلب',
                'icon' => 'crepes.png',
                'addons' => [
                    ['name' => 'نوتيلا زيادة', 'price' => 1],
                    ['name' => 'موز', 'price' => 0.75],
                ],
                'products' => [
                    ['title' => 'كريب نوتيلا وموز', 'subtitle' => 'الكلاسيكي', 'description' => 'كريب سخن محشي نوتيلا وشرائح موز.', 'price' => 4.5, 'featured' => true],
                    ['title' => 'Lotus Crêpe', 'description' => 'Lotus Biscoff spread, crushed biscuits and a drizzle of white chocolate.', 'subtitle' => 'صوص وبسكوت لوتس', 'price' => 5.5],
                    ['title' => 'كريب فواكه', 'subtitle' => 'فريز، موز، كيوي', 'price' => 6],
                    ['title' => 'كريب دجاج وجبنة', 'subtitle' => 'مالح', 'price' => 6.5],
                ],
            ],
            [
                'title' => 'وافل وبان كيك',
                'subtitle' => 'سخن من الصاج',
                'icon' => 'waffle.png',
                'addons' => [
                    ['name' => 'بوظة فانيلا', 'price' => 1.5],
                ],
                'products' => [
                    ['title' => 'وافل نوتيلا', 'subtitle' => 'مع موز وفريز', 'description' => 'وافل بلجيكي سخن مغطّى نوتيلا وفواكه موسمية.', 'price' => 5, 'photo' => 'waffle', 'featured' => true],
                    ['title' => 'Kinder Waffle', 'subtitle' => 'صوص كيندر وقطع شوكولا', 'price' => 5.5],
                    ['title' => 'بان كيك بالعسل', 'subtitle' => '٣ طبقات مع زبدة', 'price' => 4.5],
                ],
            ],
            [
                'title' => 'حلويات',
                'subtitle' => 'خلي محل للحلو',
                'icon' => 'strawberry-cake.png',
                'addons' => null,
                'products' => [
                    ['title' => 'كيك فريز', 'subtitle' => 'شريحة طازة', 'price' => 4],
                    ['title' => 'كنافة بالجبن', 'subtitle' => 'بكعكة سمسم', 'price' => 4, 'days' => [1, 5, 6, 7]],
                    ['title' => 'Chocolate Chip Cookies', 'subtitle' => '3 pcs · سخن من الفرن', 'price' => 3],
                ],
            ],
            [
                'title' => 'Milkshakes & Frappé',
                'subtitle' => 'مخفوق بارد',
                'icon' => 'milkshake.png',
                'addons' => [
                    ['name' => 'Whipped cream', 'price' => 0.5],
                ],
                'products' => [
                    ['title' => 'Oreo Milkshake', 'subtitle' => 'Vanilla ice cream & Oreo crumbs', 'price' => 4.5, 'variants' => [
                        ['name' => 'Medium', 'price' => 4.5, 'discount_price' => null],
                        ['name' => 'Large', 'price' => 5.5, 'discount_price' => null],
                    ]],
                    ['title' => 'ميلك شيك فريز', 'price' => 4.5],
                    ['title' => 'Caramel Frappé', 'subtitle' => 'قهوة مثلجة', 'price' => 4],
                ],
            ],
            [
                'title' => 'عصير طازة',
                'subtitle' => 'معصور عالطلب',
                'icon' => 'juice (1).png',
                'addons' => null,
                'products' => [
                    ['title' => 'عصير ليموناضة بالنعنع', 'subtitle' => 'معصور عالطلب', 'price' => 2.5, 'vegan' => true],
                    ['title' => 'كوكتيل فواكه', 'subtitle' => 'موز، فريز، أفوكادو', 'price' => 4, 'vegan' => true],
                    ['title' => 'عصير برتقال', 'price' => 3, 'vegan' => true],
                ],
            ],
            [
                'title' => 'مشروبات',
                'subtitle' => 'باردة وساخنة',
                'icon' => 'drink.png',
                'addons' => null,
                'products' => [
                    ['title' => 'عيران', 'subtitle' => 'لبن مخضوض بارد', 'price' => 1.5],
                    ['title' => 'Soft Drink', 'subtitle' => 'Pepsi, 7Up, Mirinda', 'price' => 1.25],
                    ['title' => 'مياه', 'price' => 0.75, 'vegan' => true],
                    ['title' => 'قهوة تركية', 'price' => 1.5, 'vegan' => true],
                ],
            ],
        ];
    }
}
