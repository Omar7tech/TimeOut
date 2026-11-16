<?php

use App\Enums\ScheduleDayDesign;
use App\Settings\GeneralSettings;
use Inertia\Testing\AssertableInertia as Assert;

test('the menu defaults to the calendar day picker', function () {
    $this->get(route('menu.dine-in'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('menu')
            ->where('scheduleDesign', ScheduleDayDesign::CALENDAR->value));
});

test('the menu passes the day picker design chosen in the dashboard', function (ScheduleDayDesign $design) {
    $settings = app(GeneralSettings::class);
    $settings->schedule_day_design = $design;
    $settings->save();

    $this->get(route('menu.dine-in'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('scheduleDesign', $design->value));
})->with(ScheduleDayDesign::cases());
