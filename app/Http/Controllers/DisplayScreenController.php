<?php

namespace App\Http\Controllers;

use App\Http\Resources\SlideResource;
use App\Models\BoardSlide;
use App\Models\DisplayScreen;
use Inertia\Inertia;
use Inertia\Response;

class DisplayScreenController extends Controller
{
    /**
     * Render a Menu Board for a Smart TV: its own carousel of slides, each
     * optionally linking to a product. Only active boards are reachable.
     */
    public function show(DisplayScreen $displayScreen): Response
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

        return Inertia::render('board', [
            'screen' => [
                'name' => $displayScreen->name,
                'orientation' => $displayScreen->orientation->value,
                'rotation_seconds' => $displayScreen->rotation_seconds,
                'display_prices' => $displayScreen->display_prices,
            ],
            'slides' => SlideResource::collection($slides)->resolve(),
        ]);
    }
}
