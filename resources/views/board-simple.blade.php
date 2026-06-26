{{--
    Simple Menu Board for OLD Smart TV browsers.

    Deliberately dependency-free: no React, no Vite, no build step. It is served
    when the board URL carries `?simple=1`, which disables the configured display
    style in favour of this one fixed slide layout.

    Compatibility notes (do not "modernise" without checking old WebKit/Tizen/WebOS):
      - Images use `background-size: cover` (with -webkit- prefix), NOT
        `object-fit`, which old TV browsers do not support.
      - No CSS grid, no flexbox `gap`, no `vh`/`vw` reliance — full-screen panels
        are positioned with absolute top/left/right/bottom.
      - JavaScript is ES5 only: var/function, setInterval, no arrow functions,
        template literals, const/let, or classList.
      - Prices are pre-formatted in PHP so the page never touches `Intl`.
--}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $name }} - Menu Board</title>
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <style>
        * {
            margin: 0;
            padding: 0;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }

        html, body {
            width: 100%;
            height: 100%;
            background: #000;
            color: #fff;
            font-family: Arial, Helvetica, sans-serif;
            overflow: hidden;
        }

        /* Each slide is a full-screen layer; only the active one is visible. */
        .slide {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: none;
            background-color: #1a1a1a;
            background-position: center center;
            background-repeat: no-repeat;
            -webkit-background-size: cover;
            background-size: cover;
        }

        .slide.active {
            display: block;
        }

        /* Solid bar pinned to the bottom keeps the details readable over any
           image without needing a gradient (poorly supported on old TVs). */
        .details {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 40px 60px;
            background: #000;
            background: rgba(0, 0, 0, 0.68);
        }

        .details.rtl {
            text-align: right;
            direction: rtl;
        }

        .caption {
            font-size: 34px;
            font-weight: bold;
            margin-bottom: 18px;
            text-shadow: 0 2px 6px #000;
        }

        .title {
            font-size: 64px;
            line-height: 1.05;
            font-weight: bold;
            text-shadow: 0 3px 10px #000;
        }

        .star {
            color: #f5c518;
            font-size: 48px;
            vertical-align: middle;
        }

        .subtitle {
            font-size: 30px;
            color: #f0f0f0;
            margin-top: 12px;
        }

        .description {
            font-size: 24px;
            color: #cccccc;
            margin-top: 12px;
            max-width: 1100px;
        }

        .details.rtl .description {
            margin-left: auto;
        }

        .badges {
            margin-top: 14px;
        }

        .badge {
            display: inline-block;
            font-size: 18px;
            font-weight: bold;
            padding: 4px 12px;
            margin-right: 10px;
            border-radius: 6px;
            text-transform: uppercase;
        }

        .details.rtl .badge {
            margin-right: 0;
            margin-left: 10px;
        }

        .badge-spicy { background: #c81e1e; color: #fff; }
        .badge-vegan { background: #1e8a3c; color: #fff; }

        .prices {
            margin-top: 20px;
        }

        .price-item {
            display: inline-block;
            background: #c81e1e;
            border: 2px solid #000;
            border-radius: 10px;
            padding: 10px 18px;
            margin-right: 14px;
            margin-top: 10px;
            vertical-align: top;
        }

        .details.rtl .price-item {
            margin-right: 0;
            margin-left: 14px;
        }

        .price-name {
            display: block;
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
            color: #fff;
        }

        .price-current {
            display: block;
            font-size: 28px;
            font-weight: bold;
            color: #fff;
        }

        .price-original {
            font-size: 18px;
            color: #ddd;
            text-decoration: line-through;
            margin-left: 10px;
        }

        .logo {
            position: absolute;
            top: 30px;
            right: 40px;
            height: 70px;
            width: auto;
            z-index: 10;
        }

        .empty {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            margin-top: -20px;
            text-align: center;
            font-size: 28px;
            color: #888;
        }
    </style>
</head>
<body>
    @if ($logo)
        <img class="logo" src="{{ $logo }}" alt="Logo">
    @endif

    @if (count($slides) === 0)
        <p class="empty">No slides yet.</p>
    @else
        @foreach ($slides as $index => $slide)
            <div class="slide{{ $index === 0 ? ' active' : '' }}"
                 @if ($slide['image']) style="background-image: url('{{ $slide['image'] }}');" @endif>

                @php
                    $product = $slide['product'];
                    $hasDetails = $product !== null || ! empty($slide['text']);
                @endphp

                @if ($hasDetails)
                    <div class="details{{ $slide['rtl'] ? ' rtl' : '' }}">
                        @if (! empty($slide['text']))
                            <div class="caption">{{ $slide['text'] }}</div>
                        @endif

                        @if ($product)
                            <div class="title">
                                {{ $product['title'] }}@if ($product['is_featured'])<span class="star">&#9733;</span>@endif
                            </div>

                            @if (! empty($product['subtitle']))
                                <div class="subtitle">{{ $product['subtitle'] }}</div>
                            @endif

                            @if (! empty($product['description']))
                                <div class="description">{{ $product['description'] }}</div>
                            @endif

                            @if ($product['is_spicy'] || $product['is_vegan'])
                                <div class="badges">
                                    @if ($product['is_spicy'])<span class="badge badge-spicy">Spicy</span>@endif
                                    @if ($product['is_vegan'])<span class="badge badge-vegan">Vegan</span>@endif
                                </div>
                            @endif

                            @if (count($product['prices']) > 0)
                                <div class="prices">
                                    @foreach ($product['prices'] as $price)
                                        <span class="price-item">
                                            @if (! empty($price['name']))
                                                <span class="price-name">{{ $price['name'] }}</span>
                                            @endif
                                            <span class="price-current">
                                                {{ $price['price']['current'] }}@if ($price['price']['original'])<span class="price-original">{{ $price['price']['original'] }}</span>@endif
                                            </span>
                                        </span>
                                    @endforeach
                                </div>
                            @endif
                        @endif
                    </div>
                @endif
            </div>
        @endforeach
    @endif

    <script>
        (function () {
            var slides = document.getElementsByClassName('slide');
            var total = slides.length;
            if (total < 2) {
                // Nothing to rotate; the single (or empty) slide stays as-is.
                return;
            }

            var current = 0;
            var intervalMs = {{ $rotationSeconds }} * 1000;

            function show(index) {
                for (var i = 0; i < total; i++) {
                    slides[i].className = 'slide';
                }
                slides[index].className = 'slide active';
            }

            setInterval(function () {
                current = (current + 1) % total;
                show(current);
            }, intervalMs);
        })();

        // Reload every 15 minutes so the board picks up new slides and avoids
        // long-run memory build-up on always-on TV browsers.
        setTimeout(function () {
            window.location.reload();
        }, 15 * 60 * 1000);
    </script>
</body>
</html>
