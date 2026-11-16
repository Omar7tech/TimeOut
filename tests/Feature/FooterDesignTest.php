<?php

use App\Enums\FooterDesign;
use App\Settings\GeneralSettings;
use Inertia\Testing\AssertableInertia as Assert;

test('the menu defaults to the classic footer', function () {
    $this->get(route('menu.dine-in'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('menu')
            ->where('footerDesign', FooterDesign::CLASSIC->value));
});

test('the menu passes the footer design chosen in the dashboard', function (FooterDesign $design) {
    $settings = app(GeneralSettings::class);
    $settings->footer_design = $design;
    $settings->save();

    $this->get(route('menu.dine-in'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('footerDesign', $design->value));
})->with(FooterDesign::cases());
