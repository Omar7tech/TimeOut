<?php

namespace App\Http\Middleware;

use App\Enums\SocialPlatform;
use App\Settings\GeneralSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = app(GeneralSettings::class);
        $lbpEnabled = $settings->show_lbp_prices && (float) $settings->lbp_exchange_rate > 0;
        $bannerText = $settings->currentBannerText();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'banner' => [
                'show' => $settings->show_banner && filled($bannerText),
                'text' => $bannerText,
            ],
            'shop' => [
                // Authoritative open/closed snapshot for this request (used for the
                // initial render); the client can recompute live in automatic mode.
                'isOpen' => $settings->isCurrentlyOpen(),
                'statusMode' => $settings->status_mode->value,
                'isManuallyOpen' => $settings->is_open,
                'openingHours' => array_map(static fn (array $hours): array => [
                    'day' => $hours['day'],
                    'isClosed' => $hours['is_closed'],
                    'opensAt' => $hours['opens_at'],
                    'closesAt' => $hours['closes_at'],
                ], array_values($settings->opening_hours)),
            ],
            'pricing' => [
                'display' => $settings->price_display->value,
                'lbpRate' => $lbpEnabled ? (float) $settings->lbp_exchange_rate : null,
                'deliveryFeeUsd' => $settings->charge_delivery ? (float) $settings->delivery_fee : null,
            ],
            // Whether the delivery (online ordering) menu is available; when off the
            // storefront is dine-in only.
            'onlineOrderingActive' => $settings->online_ordering_active,
            // The WhatsApp number orders are sent to (only while ordering is active).
            'whatsappNumber' => $settings->online_ordering_active ? $settings->whatsapp_number : null,
            // Whether the customer must provide their full name before ordering.
            'requireFullName' => $settings->require_full_name,
            // Whether the customer must provide their phone number before ordering.
            'requirePhoneNumber' => $settings->require_phone_number,
            // Whether to request the customer's location and attach it to the order.
            'getClientLocation' => $settings->get_client_location,
            // Floating WhatsApp chat badge config for the storefront.
            'whatsappBadge' => [
                'show' => $settings->show_whatsapp_badge && filled($settings->whatsapp_badge_number),
                'number' => $settings->whatsapp_badge_number,
            ],
            'socials' => collect($settings->social_links)
                ->map(function ($link): ?array {
                    if (! is_array($link)) {
                        return null;
                    }

                    $rawPlatform = $link['platform'] ?? null;
                    $platform = $rawPlatform instanceof SocialPlatform
                        ? $rawPlatform
                        : SocialPlatform::tryFrom((string) $rawPlatform);
                    $url = $link['url'] ?? null;

                    if ($platform === null || blank($url)) {
                        return null;
                    }

                    return [
                        'platform' => $platform->value,
                        'label' => $platform->getName(),
                        'url' => $url,
                        'icon' => $platform->getIconPath(),
                    ];
                })
                ->filter()
                ->values()
                ->all(),
        ];
    }
}
