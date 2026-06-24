<?php

namespace App\Filament\Resources\Slides\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class SlidesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->reorderable('sort_order')
            ->defaultSort('sort_order')
            ->columns([
                SpatieMediaLibraryImageColumn::make('image')
                    ->label('Image')
                    ->collection('image')
                    ->conversion('slider'),
                TextColumn::make('product.title')
                    ->label('Links to')
                    ->badge()
                    ->color(fn ($state): string => $state ? 'success' : 'gray')
                    ->placeholder('Plain image')
                    ->formatStateUsing(fn (?string $state): string => $state ?? 'Plain image'),
                TextColumn::make('schedule_status')
                    ->label('Schedule')
                    ->badge()
                    ->color('warning')
                    ->icon(Heroicon::OutlinedCalendarDays)
                    ->placeholder('—')
                    ->state(fn ($record): ?string => $record->product?->has_schedule ? 'Auto Scheduled' : null),
                ToggleColumn::make('is_active')
                    ->label('Active')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TernaryFilter::make('is_active')
                    ->label('Active'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
