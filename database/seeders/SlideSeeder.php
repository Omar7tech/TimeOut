<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Slide;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class SlideSeeder extends Seeder
{
    /**
     * The carousel exactly as the live site runs it, in order: the product
     * each slide opens and the line laid over it. A slide's artwork is
     * `images/slides/{position}.webp`; a slide without one shows its
     * product's photo instead.
     *
     * @var list<array{product: string, text: string|null}>
     */
    private const SLIDES = [
        ['product' => 'frog-aaalghaz', 'text' => null],
        ['product' => 'shaorma-dgag', 'text' => 'شاورما عالميه'],
        ['product' => 'shaorma-lhm-aagl', 'text' => null],
        ['product' => 'dgag-mshoy', 'text' => null],
        ['product' => 'fyly-styk', 'text' => null],
        ['product' => 'fahyta', 'text' => null],
        ['product' => 'shaorma-dgag', 'text' => 'شاورما عالميه'],
        ['product' => 'frnsysko', 'text' => null],
        ['product' => 'rosto-lhm', 'text' => null],
    ];

    /**
     * Seed the carousel once: when any slide already exists the carousel is
     * left exactly as the admin has it.
     */
    public function run(): void
    {
        if (Slide::query()->exists()) {
            return;
        }

        foreach (self::SLIDES as $index => $slideData) {
            $product = Product::query()->where('slug', $slideData['product'])->first();

            if ($product === null) {
                $this->command?->warn("No product with slug [{$slideData['product']}] for a slide.");

                continue;
            }

            $slide = Slide::query()->create([
                'product_id' => $product->id,
                'text' => $slideData['text'],
                'is_active' => true,
                'sort_order' => $index,
            ]);

            $artwork = database_path('seeders/images/slides/'.($index + 1).'.webp');

            if (! File::exists($artwork)) {
                $artwork = database_path("seeders/images/products/{$product->slug}.webp");
            }

            if (! File::exists($artwork)) {
                continue;
            }

            // The media library moves the file it is given, so it gets a copy:
            // the seed image stays in the repository for the next deploy.
            $copy = sys_get_temp_dir().DIRECTORY_SEPARATOR.Str::uuid().'.webp';
            File::copy($artwork, $copy);

            $slide->addMedia($copy)->toMediaCollection('image');
        }
    }
}
