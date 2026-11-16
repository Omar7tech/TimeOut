<?php

use App\Enums\CategoryCardDesign;
use App\Settings\GeneralSettings;
use Inertia\Testing\AssertableInertia as Assert;

test('the menu defaults to the slab section cards', function () {
    $this->get(route('menu.dine-in'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('menu')
            ->where('categoryDesign', CategoryCardDesign::SLAB->value));
});

test('the menu passes the section card design chosen in the dashboard', function (CategoryCardDesign $design) {
    $settings = app(GeneralSettings::class);
    $settings->category_card_design = $design;
    $settings->save();

    $this->get(route('menu.dine-in'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('categoryDesign', $design->value));
})->with(CategoryCardDesign::cases());
