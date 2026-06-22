<?php

namespace App\Settings;

use App\Enums\BannerMode;
use App\Enums\PriceDisplay;
use App\Enums\ShopStatusMode;
use App\Enums\Weekday;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;
use Spatie\LaravelSettings\Settings;
use Spatie\LaravelSettings\SettingsCasts\EnumCast;

class GeneralSettings extends Settings
{
    /**
     * How the shop's open/closed state is decided: by hand (`MANUAL`) or from
     * the weekly {@see self::$opening_hours} schedule (`AUTOMATIC`).
     */
    public ShopStatusMode $status_mode;

    /**
     * The manual open/closed switch. Only authoritative when the status mode is
     * `MANUAL`; drives the storefront logo (open vs. closed) and can gate ordering.
     */
    public bool $is_open;

    /**
     * The weekly opening-hours schedule used when the status mode is `AUTOMATIC`.
     * One entry per weekday, keyed by JS-style day number (0 = Sunday). Each entry
     * is shaped `['day' => int, 'is_closed' => bool, 'opens_at' => string, 'closes_at' => string]`.
     *
     * Note: no `@var` value type is declared because spatie/laravel-settings cannot
     * resolve a complex array-shape docblock here (it would throw at runtime).
     */
    public array $opening_hours; // @phpstan-ignore missingType.iterableValue

    /**
     * Whether to show a promotional banner above the storefront header.
     */
    public bool $show_banner;

    /**
     * How the banner sentence is chosen: a single fixed message (`FIXED`) or a
     * per-weekday message from {@see self::$banner_schedule} (`SCHEDULED`).
     */
    public BannerMode $banner_mode;

    /**
     * The banner message shown above the header when {@see self::$show_banner} is on
     * and the mode is `FIXED`.
     */
    public ?string $banner_text;

    /**
     * The per-weekday banner sentences used when the mode is `SCHEDULED`. One entry
     * per weekday, keyed by JS-style day number (0 = Sunday), shaped
     * `['day' => int, 'text' => string]`.
     *
     * Note: no `@var` value type is declared because spatie/laravel-settings cannot
     * resolve a complex array-shape docblock here (it would throw at runtime).
     */
    public array $banner_schedule; // @phpstan-ignore missingType.iterableValue

    /**
     * Whether a delivery charge is added to takeaway orders.
     */
    public bool $charge_delivery;

    /**
     * The delivery charge in USD, applied when {@see self::$charge_delivery} is on.
     */
    public ?float $delivery_fee;

    public ?float $lbp_exchange_rate;

    public bool $show_lbp_prices;

    /**
     * Which currency the storefront prices are displayed in.
     */
    public PriceDisplay $price_display;

    /**
     * The social media links shown in the storefront footer. Each entry is a
     * single platform paired with its URL, shaped `['platform' => string, 'url' => string]`.
     * Each platform may appear at most once.
     *
     * Note: no `@var` value type is declared because spatie/laravel-settings cannot
     * resolve a complex array-shape docblock here (it would throw at runtime).
     */
    public array $social_links; // @phpstan-ignore missingType.iterableValue

    /**
     * Whether customers can place orders online via WhatsApp.
     */
    public bool $online_ordering_active;

    /**
     * The WhatsApp number that online orders are sent to.
     */
    public ?string $whatsapp_number;

    /**
     * Whether customers must provide their full name before sending an order.
     */
    public bool $require_full_name;

    /**
     * Whether to request the customer's location and attach it to their order.
     */
    public bool $get_client_location;

    /**
     * Whether the storefront shows a weekly schedule of scheduled products, so
     * customers can see which items are available on each day.
     */
    public bool $show_product_schedule;

    public static function group(): string
    {
        return 'general';
    }

    /**
     * @return array<string, EnumCast>
     */
    public static function casts(): array
    {
        return [
            'status_mode' => new EnumCast(ShopStatusMode::class),
            'price_display' => new EnumCast(PriceDisplay::class),
            'banner_mode' => new EnumCast(BannerMode::class),
        ];
    }

    /**
     * The default per-weekday banner schedule: the same welcome message on every
     * day, ready for the shop to customise per day.
     *
     * @return array<int, array{day: int, text: string}>
     */
    public static function defaultBannerSchedule(): array
    {
        return array_map(static fn (Weekday $day): array => [
            'day' => $day->value,
            'text' => 'Welcome To Time Out Snack',
        ], Weekday::cases());
    }

    /**
     * The banner sentence to show right now, resolving the active banner mode.
     * Returns the fixed text, or the scheduled text for the given weekday.
     */
    public function currentBannerText(?CarbonInterface $now = null): ?string
    {
        if ($this->banner_mode === BannerMode::FIXED) {
            return $this->banner_text;
        }

        $today = collect($this->banner_schedule)
            ->firstWhere('day', ($now ?? Carbon::now())->dayOfWeek);

        return $today['text'] ?? null;
    }

    /**
     * The default weekly schedule: every day open from 09:00 to 17:00. Used as
     * the baseline both when seeding settings and when resetting the schedule.
     *
     * @return array<int, array{day: int, is_closed: bool, opens_at: string, closes_at: string}>
     */
    public static function defaultOpeningHours(): array
    {
        return array_map(static fn (Weekday $day): array => [
            'day' => $day->value,
            'is_closed' => false,
            'opens_at' => '09:00',
            'closes_at' => '17:00',
        ], Weekday::cases());
    }

    /**
     * Whether the shop is open right now, resolving the active status mode.
     */
    public function isCurrentlyOpen(?CarbonInterface $now = null): bool
    {
        if ($this->status_mode === ShopStatusMode::MANUAL) {
            return $this->is_open;
        }

        return $this->isWithinSchedule($now ?? Carbon::now());
    }

    /**
     * Whether the given moment falls inside the opening hours for its weekday.
     * Closing times at or before the opening time are treated as crossing
     * midnight (e.g. open 18:00, close 02:00).
     */
    protected function isWithinSchedule(CarbonInterface $now): bool
    {
        $today = collect($this->opening_hours)
            ->firstWhere('day', $now->dayOfWeek);

        if ($today === null || ($today['is_closed'] ?? false)) {
            return false;
        }

        $opensAt = $now->copy()->setTimeFromTimeString($today['opens_at']);
        $closesAt = $now->copy()->setTimeFromTimeString($today['closes_at']);

        if ($closesAt->lessThanOrEqualTo($opensAt)) {
            $closesAt->addDay();
        }

        return $now->betweenIncluded($opensAt, $closesAt);
    }
}
