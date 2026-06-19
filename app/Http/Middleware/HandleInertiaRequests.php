<?php

namespace App\Http\Middleware;

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

        // Only expose the LBP rate to the client when LBP pricing is actually
        // enabled, so the front-end can safely convert prices on its own.
        $lbpEnabled = $settings->show_lbp_prices && (float) $settings->lbp_exchange_rate > 0;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'pricing' => [
                'display' => $settings->price_display->value,
                'lbpRate' => $lbpEnabled ? (float) $settings->lbp_exchange_rate : null,
            ],
        ];
    }
}
