<?php

namespace App\Filament\Resources\Products\Tables;

use App\Enums\OrderType;
use App\Filament\Tables\Columns\PriceColumn;
use App\Settings\GeneralSettings;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ProductsTable
{
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
                TextColumn::make('schedules_count')
                    ->label('Schedules')
                    ->counts('schedules')
                    ->badge()
                    ->color(fn (int $state): string => $state > 0 ? 'warning' : 'gray')
                    ->formatStateUsing(fn (int $state): string => $state > 0 ? "{$state} rule(s)" : 'Always'),
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
                TernaryFilter::make('schedules')
                    ->label('Scheduled')
                    ->placeholder('All products')
                    ->trueLabel('Has schedule')
                    ->falseLabel('Always available')
                    ->queries(
                        true: fn (Builder $query): Builder => $query->has('schedules'),
                        false: fn (Builder $query): Builder => $query->doesntHave('schedules'),
                        blank: fn (Builder $query): Builder => $query,
                    ),
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
