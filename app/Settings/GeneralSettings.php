<?php

namespace App\Settings;

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
     * The banner message shown above the header when {@see self::$show_banner} is on.
     */
    public ?string $banner_text;

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
        ];
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
