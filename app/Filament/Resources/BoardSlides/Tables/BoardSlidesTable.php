<?php

namespace App\Filament\Resources\BoardSlides\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class BoardSlidesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                SpatieMediaLibraryImageColumn::make('image')
                    ->label('Image')
                    ->collection('image')
                    ->conversion('slider'),
                TextColumn::make('text')
                    ->label('Text')
                    ->placeholder('—')
                    ->limit(30)
                    ->wrap()
                    ->searchable(),
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
                    ->state(fn ($record): ?string => match (true) {
                        (bool) $record->product?->has_schedule => 'Auto Scheduled',
                        (bool) $record->custom_schedule => 'Scheduled',
                        default => null,
                    }),
                TextColumn::make('displayScreens.name')
                    ->label('Boards')
                    ->badge()
                    ->color('gray')
                    ->limitList(3)
                    ->placeholder('Not on any board'),
                ToggleColumn::make('is_active')
                    ->label('Active')
                    ->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_active')
                    ->label('Active'),
                TernaryFilter::make('custom_schedule')
                    ->label('Custom schedule'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
