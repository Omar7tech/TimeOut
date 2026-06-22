<?php

namespace App\Filament\Resources\Products\Tables;

use App\Enums\OrderType;
use App\Filament\Tables\Columns\PriceColumn;
use App\Models\Product;
use App\Settings\GeneralSettings;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ProductsTable
{
    /**
     * @var array<int, string>
     */
    private const DAYS = [
        1 => 'Mon',
        2 => 'Tue',
        3 => 'Wed',
        4 => 'Thu',
        5 => 'Fri',
        6 => 'Sat',
        7 => 'Sun',
    ];

    public static function configure(Table $table): Table
    {
        $settings = app(GeneralSettings::class);
        $lbpRate = $settings->show_lbp_prices ? $settings->lbp_exchange_rate : null;

        return $table
            ->reorderable('sort_order')
            ->defaultSort('sort_order')
            ->columns([
                SpatieMediaLibraryImageColumn::make('image')
                    ->label('Image')
                    ->collection('image')
                    ->conversion('webp')
                    ->circular(),
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight('medium')
                    ->description(fn ($record): ?string => $record->subtitle),
                TextColumn::make('category.title')
                    ->label('Category')
                    ->badge()
                    ->color('info')
                    ->sortable(),
                PriceColumn::make('price')
                    ->label('Price')
                    ->sortable()
                    ->lbpRate($lbpRate),
                TextColumn::make('order_type')
                    ->label('Order type')
                    ->badge()
                    ->sortable(),
                TextColumn::make('available_days')
                    ->label('Available')
                    ->badge()
                    ->color(fn (Product $record): string => $record->has_schedule ? 'warning' : 'gray')
                    ->placeholder('Always')
                    ->formatStateUsing(fn (int $state): string => self::DAYS[$state] ?? (string) $state),
                IconColumn::make('is_spicy')
                    ->label('Spicy')
                    ->boolean()
                    ->trueIcon(Heroicon::Fire)
                    ->trueColor('danger')
                    ->falseIcon(Heroicon::Minus)
                    ->falseColor('gray')
                    ->sortable(),
                IconColumn::make('is_vegan')
                    ->label('Vegan')
                    ->boolean()
                    ->trueIcon(Heroicon::Sparkles)
                    ->trueColor('success')
                    ->falseIcon(Heroicon::Minus)
                    ->falseColor('gray')
                    ->sortable(),
                ToggleColumn::make('is_active')
                    ->label('Active')
                    ->sortable(),
                ToggleColumn::make('is_featured')
                    ->label('Featured')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->relationship('category', 'title')
                    ->searchable()
                    ->preload(),
                SelectFilter::make('order_type')
                    ->label('Order type')
                    ->options(OrderType::class),
                TernaryFilter::make('is_active')
                    ->label('Active'),
                TernaryFilter::make('is_featured')
                    ->label('Featured'),
                TernaryFilter::make('is_spicy')
                    ->label('Spicy'),
                TernaryFilter::make('is_vegan')
                    ->label('Vegan'),
                TernaryFilter::make('discount_price')
                    ->label('Discount')
                    ->placeholder('All products')
                    ->trueLabel('On discount')
                    ->falseLabel('Full price')
                    ->queries(
                        true: fn (Builder $query): Builder => $query->whereNotNull('discount_price'),
                        false: fn (Builder $query): Builder => $query->whereNull('discount_price'),
                        blank: fn (Builder $query): Builder => $query,
                    ),
                TernaryFilter::make('has_schedule')
                    ->label('Scheduled')
                    ->placeholder('All products')
                    ->trueLabel('Limited to days')
                    ->falseLabel('Always available'),
            ])
            ->filtersFormColumns(2)
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
