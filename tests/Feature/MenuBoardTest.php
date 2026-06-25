<?php

use App\Models\BoardSlide;
use App\Models\DisplayScreen;
use App\Models\Product;

test('an active menu board renders with its active slides', function () {
    $screen = DisplayScreen::factory()->create(['rotation_seconds' => 9]);
    BoardSlide::factory()->for($screen)->create(['sort_order' => 1]);
    BoardSlide::factory()->for($screen)->forProduct()->create(['sort_order' => 2]);
    // Inactive slides and slides on other boards must not appear.
    BoardSlide::factory()->for($screen)->create(['is_active' => false]);
    BoardSlide::factory()->create();

    $this->get(route('board.show', $screen))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('board')
            ->where('screen.name', $screen->name)
            ->where('screen.rotation_seconds', 9)
            ->has('slides', 2)
        );
});

test('an inactive menu board is not reachable', function () {
    $screen = DisplayScreen::factory()->inactive()->create();

    $this->get(route('board.show', $screen))->assertNotFound();
});

test('a slide whose product is hidden degrades to a plain image', function () {
    $screen = DisplayScreen::factory()->create();
    $product = Product::factory()->create(['is_active' => false]);
    BoardSlide::factory()->for($screen)->forProduct($product->id)->create();

    $this->get(route('board.show', $screen))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('slides', 1)
            ->where('slides.0.product', null)
        );
});
