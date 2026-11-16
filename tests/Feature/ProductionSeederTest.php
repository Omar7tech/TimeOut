<?php

use App\Enums\PriceDisplay;
use App\Enums\ShopStatusMode;
use App\Models\Category;
use App\Models\Product;
use App\Models\Slide;
use App\Settings\GeneralSettings;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('the database seeder rebuilds the live menu with its images', function () {
    $this->seed(DatabaseSeeder::class);

    expect(Category::query()->orderBy('sort_order')->pluck('slug')->all())
        ->toBe(['burgers', 'shaorma', 'mndy', 'frog', 'sndoysh', 'mshaoy', 'plate', 'box'])
        ->and(Product::query()->count())->toBe(22)
        ->and(Product::query()->where('is_active', false)->pluck('slug')->all())->toBe(['shaorma-smk'])
        ->and(Slide::query()->count())->toBe(9);

    $chicken = Product::query()->where('slug', 'frog-aaalghaz')->firstOrFail();

    expect($chicken->category->slug)->toBe('frog')
        ->and($chicken->variants)->toBe([
            ['name' => 'فروج', 'price' => 11.11, 'discount_price' => null],
            ['name' => 'نصف فروج', 'price' => 6.66, 'discount_price' => null],
        ])
        ->and($chicken->available_days)->toBe([1, 2, 3, 4, 5, 6, 7]);

    expect(Product::query()->where('slug', 'dgag-mshoy')->value('has_schedule'))->toBeFalsy();

    Category::query()->each(fn (Category $category) => expect($category->hasMedia('image'))->toBeTrue());
    Product::query()->each(fn (Product $product) => expect($product->hasMedia('image'))->toBeTrue());
    Slide::query()->each(fn (Slide $slide) => expect($slide->hasMedia('image'))->toBeTrue());

    $settings = app(GeneralSettings::class);

    expect($settings->status_mode)->toBe(ShopStatusMode::AUTOMATIC)
        ->and($settings->price_display)->toBe(PriceDisplay::BOTH)
        ->and($settings->opening_hours[0]['closes_at'])->toBe('22:00');
});

test('reseeding adds nothing and keeps admin edits', function () {
    $this->seed(DatabaseSeeder::class);

    Product::query()->where('slug', 'taook')->update(['price' => 9]);

    $this->seed(DatabaseSeeder::class);

    expect(Product::query()->count())->toBe(22)
        ->and(Slide::query()->count())->toBe(9)
        ->and((float) Product::query()->where('slug', 'taook')->value('price'))->toBe(9.0);
});
