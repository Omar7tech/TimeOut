<?php

namespace Database\Seeders;

use App\Enums\BannerMode;
use App\Enums\PriceDisplay;
use App\Enums\ShopStatusMode;
use App\Enums\Weekday;
use App\Models\Category;
use App\Settings\GeneralSettings;
use Illuminate\Database\Seeder;

class GeneralSettingsSeeder extends Seeder
{
    /**
     * Put the shop settings the live Time Out Snack site runs with in place:
     * open 09:00–22:00 every day on automatic hours, the welcome banner,
     * dollar and lira prices at 90,000, the weekly schedule, online ordering
     * on WhatsApp with name, phone and location, and the WhatsApp badge.
     *
     * Settings the live site doesn't show (the new design choices) keep their
     * defaults. It only runs on an empty menu, i.e. a fresh install, so
     * reseeding never resets settings changed in the admin.
     */
    public function run(): void
    {
        if (Category::query()->exists()) {
            return;
        }

        $settings = app(GeneralSettings::class);

        $settings->status_mode = ShopStatusMode::AUTOMATIC;
        $settings->is_open = true;
        $settings->opening_hours = array_map(static fn (Weekday $day): array => [
            'day' => $day->value,
            'is_closed' => false,
            'opens_at' => '09:00',
            'closes_at' => '22:00',
        ], Weekday::cases());

        $settings->show_banner = true;
        $settings->banner_mode = BannerMode::FIXED;
        $settings->banner_text = 'Welcome To Time Out Snack';

        $settings->show_lbp_prices = true;
        $settings->lbp_exchange_rate = 90000;
        $settings->price_display = PriceDisplay::BOTH;
        $settings->charge_delivery = true;
        $settings->delivery_fee = 3;

        $settings->online_ordering_active = true;
        $settings->whatsapp_number = '+9613150099';
        $settings->require_full_name = true;
        $settings->require_phone_number = true;
        $settings->get_client_location = true;

        $settings->show_product_schedule = true;
        $settings->show_whatsapp_badge = true;
        $settings->whatsapp_badge_number = '+9613150099';

        $settings->social_links = [
            ['platform' => 'instagram', 'url' => 'https://timeoutsnack.com/menu/delivery'],
        ];

        $settings->save();
    }
}
