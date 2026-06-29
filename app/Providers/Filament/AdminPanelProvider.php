<?php

namespace App\Providers\Filament;

use App\Filament\Widgets\BoardStatsOverview;
use Caresome\FilamentAuthDesigner\AuthDesignerPlugin;
use Caresome\FilamentAuthDesigner\Data\AuthPageConfig;
use Caresome\FilamentAuthDesigner\Enums\MediaPosition;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Pages\Enums\SubNavigationPosition;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Enums\Width;
use Filament\Widgets\AccountWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin-9fx5y2io')
            ->viteTheme('resources/css/filament/admin/theme.css')
            ->login()
            ->colors([
                'primary' => Color::hex('#f25100'),
            ])
            ->maxContentWidth(Width::Full)
            ->sidebarCollapsibleOnDesktop()
            ->spa()
            ->sidebarWidth('14rem')
            ->profile()
            ->brandLogo(asset('logos/timeout-logo-on-light.png'))
            ->darkModeBrandLogo(asset('logos/timeout-logo.png'))
            ->brandLogoHeight('3rem')
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                AccountWidget::class,
                BoardStatsOverview::class,
            ])
            ->navigationGroups([
                'Menu',
                'Displays',
                'Settings',
            ])
            ->subNavigationPosition(SubNavigationPosition::Top)
            ->darkMode(true)
            ->plugin(
                AuthDesignerPlugin::make()
                    ->login(
                        fn (AuthPageConfig $config) => $config
                            ->media(asset('cover/cover.webp'))
                            ->mediaPosition(MediaPosition::Left)
                            ->mediaSize('65%')
                            ->themeToggle()
                    )
            )
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
