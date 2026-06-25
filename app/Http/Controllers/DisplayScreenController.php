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
            ->where('is_active', true)
            ->with(['media', 'product.media', 'product.category'])
            ->get()
            // Drop slides whose linked product was removed; SlideResource already
            // degrades an inactive product to a plain image.
            ->filter(fn (BoardSlide $slide): bool => $slide->product_id === null || $slide->product !== null)
            ->values();

        return Inertia::render('board', [
            'screen' => [
                'name' => $displayScreen->name,
                'orientation' => $displayScreen->orientation->value,
                'rotation_seconds' => $displayScreen->rotation_seconds,
            ],
            'slides' => SlideResource::collection($slides)->resolve(),
        ]);
    }
}
