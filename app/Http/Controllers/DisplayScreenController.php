<?php

namespace App\Http\Controllers;

use App\Http\Resources\SlideResource;
use App\Models\BoardSlide;
use App\Models\DisplayScreen;
use App\Settings\GeneralSettings;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DisplayScreenController extends Controller
{
    /** LBP prices are rounded to the nearest multiple of this for clean amounts. */
    private const LBP_ROUNDING_STEP = 5000;

    /**
     * Render a Menu Board for a Smart TV: its own carousel of slides, each
     * optionally linking to a product. Only active boards are reachable.
     *
     * The default is the rich React board. Passing `?simple=1` instead serves a
     * dependency-free HTML/CSS/JS page (one fixed slide style, no chosen layout)
     * that runs on the dated browsers built into older Smart TVs.
     */
    public function show(Request $request, DisplayScreen $displayScreen): Response|Renderable
    {
        abort_unless($displayScreen->is_active, 404);

        $slides = $displayScreen->slides()
            ->where('board_slides.is_active', true)
            ->with(['media', 'product.media', 'product.category'])
            ->get()
            // A product-linked slide follows its product's availability (hidden
            // when inactive or not scheduled today). A plain slide follows its
            // own optional custom weekday schedule.
            ->filter(fn (BoardSlide $slide): bool => $slide->product !== null
                ? $slide->product->isAvailableNow()
                : $slide->isScheduledNow())
            ->values();

        // Simple mode disables the configured display style and serves the plain,
        // old-TV-friendly Blade page instead. Defaults to off.
        if ($request->boolean('simple')) {
            return $this->simpleBoard($displayScreen, $slides);
        }

        return Inertia::render('board', [
            'screen' => [
                'name' => $displayScreen->name,
                'orientation' => $displayScreen->orientation->value,
                'layout' => $displayScreen->layout->value,
                'rotation_seconds' => $displayScreen->rotation_seconds,
                'display_prices' => $displayScreen->display_prices,
                // The white logo suits the board's dark background.
                'logo' => $displayScreen->show_logo ? asset('logos/timeout-logo.png') : null,
            ],
            'slides' => SlideResource::collection($slides)->resolve(),
        ]);
    }

    /**
     * Render the plain HTML board for old Smart TV browsers. Prices are formatted
     * here in PHP so the page needs no `Intl`, and each slide is reduced to a flat
     * array of strings the Blade can print without any client-side logic.
     *
     * @param  Collection<int, BoardSlide>  $slides
     */
    private function simpleBoard(DisplayScreen $displayScreen, Collection $slides): Renderable
    {
        $settings = app(GeneralSettings::class);
        $rate = (float) $settings->lbp_exchange_rate;
        $lbpEnabled = $settings->show_lbp_prices && $rate > 0;
        $display = $settings->price_display->value;
        $showUsd = $display === 'usd' || $display === 'both';
        $showLbp = ($display === 'lbp' || $display === 'both') && $lbpEnabled;

        $formatPrice = function (float $base, ?float $discount) use ($showUsd, $showLbp, $rate): array {
            $effective = $discount ?? $base;
            $parts = [];

            if ($showUsd) {
                $parts[] = '$'.number_format($effective, 2);
            }

            if ($showLbp) {
                $lbp = round(($effective * $rate) / self::LBP_ROUNDING_STEP) * self::LBP_ROUNDING_STEP;
                $parts[] = number_format($lbp, 0).' LBP';
            }

            return [
                'current' => implode('  •  ', $parts),
                // Only struck-through originals make sense for USD; keep it simple.
                'original' => $discount !== null && $showUsd ? '$'.number_format($base, 2) : null,
            ];
        };

        $simpleSlides = $slides->map(function (BoardSlide $slide) use ($displayScreen, $formatPrice): array {
            $product = $slide->product && $slide->product->is_active ? $slide->product : null;
            $caption = $product?->title ?? $slide->text ?? '';

            $productData = null;

            if ($product) {
                $variants = is_array($product->variants) ? $product->variants : [];

                $prices = [];

                if ($displayScreen->display_prices) {
                    if ($variants !== []) {
                        foreach ($variants as $variant) {
                            $prices[] = [
                                'name' => $variant['name'] ?? '',
                                'price' => $formatPrice((float) ($variant['price'] ?? 0), isset($variant['discount_price']) ? (float) $variant['discount_price'] : null),
                            ];
                        }
                    } else {
                        $prices[] = [
                            'name' => '',
                            'price' => $formatPrice((float) $product->price, $product->discount_price !== null ? (float) $product->discount_price : null),
                        ];
                    }
                }

                $productData = [
                    'title' => $product->title,
                    'subtitle' => $product->subtitle,
                    'description' => $product->description,
                    'is_featured' => (bool) $product->is_featured,
                    'is_spicy' => (bool) $product->is_spicy,
                    'is_vegan' => (bool) $product->is_vegan,
                    'prices' => $prices,
                ];
            }

            return [
                'image' => $slide->getFirstMediaUrl('image', 'slider') ?: ($slide->getFirstMediaUrl('image') ?: null),
                'text' => $slide->text,
                'rtl' => preg_match('/\p{Arabic}/u', $caption) === 1,
                'product' => $productData,
            ];
        })->values()->all();

        return view('board-simple', [
            'name' => $displayScreen->name,
            // Clamp to a sane floor so a misconfigured 0 can't freeze on one slide.
            'rotationSeconds' => max($displayScreen->rotation_seconds, 2),
            'logo' => $displayScreen->show_logo ? asset('logos/timeout-logo.png') : null,
            'slides' => $simpleSlides,
        ]);
    }
}
