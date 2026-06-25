<?php

namespace App\Filament\Widgets;

use App\Models\BoardSlide;
use App\Models\Category;
use App\Models\DisplayScreen;
use App\Models\Product;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class BoardStatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $activeProducts = Product::query()->where('is_active', true)->count();
        $activeBoards = DisplayScreen::query()->where('is_active', true)->count();

        return [
            Stat::make('Products', (string) Product::query()->count())
                ->description("{$activeProducts} active")
                ->descriptionIcon(Heroicon::OutlinedShoppingBag)
                ->color('success'),

            Stat::make('Categories', (string) Category::query()->count())
                ->description('Menu sections')
                ->descriptionIcon(Heroicon::OutlinedRectangleStack)
                ->color('info'),

            Stat::make('Menu Boards', (string) DisplayScreen::query()->count())
                ->description("{$activeBoards} active")
                ->descriptionIcon(Heroicon::OutlinedTv)
                ->color('warning'),

            Stat::make('Board Slides', (string) BoardSlide::query()->count())
                ->description('Across all boards')
                ->descriptionIcon(Heroicon::OutlinedPhoto)
                ->color('primary'),
        ];
    }
}
