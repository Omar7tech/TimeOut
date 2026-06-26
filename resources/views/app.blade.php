<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- SEO: fixed meta for all pages (no SSR) --}}
    @php
        $seoName = config('app.name', 'TimeOut™');
        $seoTitle = $seoName . ' | Shawarma, Burgers & Lebanese Fast Food in Aley';
        $seoDescription = 'TimeOut™ in Aley, Lebanon — authentic Lebanese shawarma, burgers, snacks, and fast food. Dine-in, takeaway, and delivery. مطعم شاورما وسناك ووجبات سريعة لبنانية في عاليه — محلي، تيك أواي، وتوصيل.';
        $seoKeywords = 'shawarma Aley, fast food Aley, Lebanese food Aley, burgers Aley, snack Aley, delivery Aley, TimeOut Aley, شاورما عاليه, سناك عاليه, وجبات سريعة عاليه, مطعم لبناني عاليه, توصيل عاليه';
        $seoImage = asset('opengraph/timeout-og.jpg');
        $seoUrl = url()->current();
        $seoHome = url('/');
        $seoPhone = '+9613150099';
        $seoWhatsapp = 'https://wa.me/9613150099?text=' . rawurlencode('Hello TimeOut Snack, I want to make an order');

        // Pull live business data from settings for richer structured data.
        $seoSocial = [];
        $seoHours = [];
        try {
            $settings = app(\App\Settings\GeneralSettings::class);

            $seoSocial = collect($settings->social_links ?? [])
                ->pluck('url')
                ->filter()
                ->values()
                ->all();

            $dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            foreach ($settings->opening_hours ?? [] as $entry) {
                if (! empty($entry['is_closed']) || ! isset($dayNames[$entry['day'] ?? -1])) {
                    continue;
                }
                $seoHours[] = [
                    '@type' => 'OpeningHoursSpecification',
                    'dayOfWeek' => $dayNames[$entry['day']],
                    'opens' => $entry['opens_at'],
                    'closes' => $entry['closes_at'],
                ];
            }
        } catch (\Throwable $e) {
            // Settings not available (e.g. before migration) — skip enrichment.
        }

        // Build a schema.org Menu from active products so dishes can surface in Google.
        // Cached for an hour to avoid querying on every page render.
        $seoMenu = \Illuminate\Support\Facades\Cache::remember('seo.menu_schema', now()->addHour(), function () use ($seoHome) {
            try {
                $sections = \App\Models\Category::query()
                    ->where('is_active', true)
                    ->with(['products' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order')])
                    ->orderBy('sort_order')
                    ->get()
                    ->filter(fn ($category) => $category->products->isNotEmpty())
                    ->map(fn ($category) => array_filter([
                        '@type' => 'MenuSection',
                        'name' => $category->title,
                        'description' => $category->subtitle ?: null,
                        'hasMenuItem' => $category->products->map(fn ($product) => array_filter([
                            '@type' => 'MenuItem',
                            'name' => $product->title,
                            'description' => $product->subtitle ?: $product->description ?: null,
                            'offers' => $product->price ? [
                                '@type' => 'Offer',
                                'price' => (string) ($product->discount_price ?: $product->price),
                                'priceCurrency' => 'USD',
                            ] : null,
                        ]))->values()->all(),
                    ]))
                    ->values()
                    ->all();

                return $sections ? [
                    '@type' => 'Menu',
                    'name' => 'Menu',
                    'url' => $seoHome,
                    'hasMenuSection' => $sections,
                ] : $seoHome;
            } catch (\Throwable $e) {
                return $seoHome;
            }
        });
    @endphp

    <meta name="description" content="{{ $seoDescription }}">
    <meta name="keywords" content="{{ $seoKeywords }}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="{{ $seoUrl }}">

    {{-- Geo / local SEO --}}
    <meta name="geo.region" content="LB">
    <meta name="geo.placename" content="Aley, Lebanon">
    <meta name="geo.position" content="33.796960416915375;35.607216347488574">
    <meta name="ICBM" content="33.796960416915375, 35.607216347488574">

    {{-- Open Graph --}}
    <meta property="og:type" content="restaurant.restaurant">
    <meta property="og:site_name" content="{{ $seoName }}">
    <meta property="og:title" content="{{ $seoTitle }}">
    <meta property="og:description" content="{{ $seoDescription }}">
    <meta property="og:url" content="{{ $seoUrl }}">
    <meta property="og:image" content="{{ $seoImage }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="ar_LB">

    {{-- Twitter --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $seoTitle }}">
    <meta name="twitter:description" content="{{ $seoDescription }}">
    <meta name="twitter:image" content="{{ $seoImage }}">

    {{-- Structured data: Restaurant (helps Google rich results & local pack) --}}
    <script type="application/ld+json">
    {!! json_encode(array_filter([
        '@context' => 'https://schema.org',
        '@type' => 'Restaurant',
        'name' => $seoName,
        'description' => $seoDescription,
        'image' => $seoImage,
        'url' => $seoHome,
        'telephone' => $seoPhone,
        'servesCuisine' => ['Lebanese', 'Fast Food', 'Shawarma', 'Burgers'],
        'priceRange' => '$$',
        'address' => [
            '@type' => 'PostalAddress',
            'streetAddress' => 'Industrial City',
            'addressLocality' => 'Aley',
            'addressRegion' => 'Mount Lebanon',
            'addressCountry' => 'LB',
        ],
        'geo' => [
            '@type' => 'GeoCoordinates',
            'latitude' => 33.796960416915375,
            'longitude' => 35.607216347488574,
        ],
        'hasMap' => 'https://maps.app.goo.gl/oqgUfzQC5yu9EVso6',
        'areaServed' => 'Aley, Lebanon',
        'acceptsReservations' => false,
        'hasMenu' => $seoMenu,
        'openingHoursSpecification' => $seoHours,
        'sameAs' => $seoSocial,
        'potentialAction' => [
            '@type' => 'OrderAction',
            'target' => $seoWhatsapp,
            'deliveryMethod' => ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet'],
        ],
    ]), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
    </script>

    {{-- Apply the saved theme before paint to avoid a flash. Defaults to dark. --}}
    <script>
        (function () {
            try {
                if (localStorage.getItem('theme') === 'light') {
                    document.documentElement.classList.remove('dark');
                } else {
                    document.documentElement.classList.add('dark');
                }
            } catch (e) {}
        })();
    </script>

    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="TimeOut™" />
    <link rel="manifest" href="/site.webmanifest" />

    @fonts

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    <x-inertia::head>
        <title>{{ $seoTitle }}</title>
    </x-inertia::head>
</head>

<body class="font-sans antialiased">
    <x-inertia::app />
</body>

</html>
