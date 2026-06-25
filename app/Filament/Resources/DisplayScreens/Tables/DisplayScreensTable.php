<?php

namespace App\Filament\Resources\DisplayScreens\Tables;

use App\Enums\ScreenOrientation;
use App\Models\DisplayScreen;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class DisplayScreensTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->reorderable('sort_order')
            ->defaultSort('sort_order')
            ->columns([
                TextColumn::make('name')
                    ->label('Name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('orientation')
                    ->label('Orientation')
                    ->badge()
                    ->sortable(),
                TextColumn::make('slides_count')
                    ->label('Slides')
                    ->counts('slides')
                    ->badge()
                    ->color('gray'),
                TextColumn::make('url')
                    ->label('URL')
                    ->state(fn (DisplayScreen $record): string => route('board.show', $record))
                    ->url(fn (DisplayScreen $record): string => route('board.show', $record))
                    ->openUrlInNewTab()
                    ->icon(Heroicon::OutlinedLink)
                    ->color('primary')
                    ->copyable()
                    ->copyMessage('URL copied')
                    ->tooltip('Open the board on a TV'),
                ToggleColumn::make('is_active')
                    ->label('Active')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('orientation')
                    ->label('Orientation')
                    ->options(ScreenOrientation::class),
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
