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

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'banner' => [
                'show' => $settings->show_banner && filled($settings->banner_text),
                'text' => $settings->banner_text,
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
            'socials' => collect($settings->social_links)
                ->map(fn (array $link): ?array => ($platform = SocialPlatform::tryFrom($link['platform'] ?? ''))
                    ? [
                        'platform' => $platform->value,
                        'label' => $platform->getName(),
                        'url' => $link['url'],
                        'icon' => $platform->getIconPath(),
                    ]
                    : null)
                ->filter()
                ->values()
                ->all(),
        ];
    }
}
