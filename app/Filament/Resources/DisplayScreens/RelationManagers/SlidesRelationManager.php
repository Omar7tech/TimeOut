<?php

namespace App\Filament\Resources\DisplayScreens\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class SlidesRelationManager extends RelationManager
{
    protected static string $relationship = 'slides';

    protected static ?string $title = 'Slides';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                SpatieMediaLibraryFileUpload::make('image')
                    ->label('Image')
                    ->collection('image')
                    ->disk('public')
                    ->visibility('public')
                    ->image()
                    ->conversion('slider')
                    ->imageEditor()
                    ->imageEditorAspectRatios(['16:9', '21:9', '3:1'])
                    ->helperText('Use a wide image (e.g. 16:9).')
                    ->required()
                    ->columnSpanFull(),

                TextInput::make('text')
                    ->label('Custom text')
                    ->helperText('Optional caption shown over the slide image.')
                    ->maxLength(255)
                    ->columnSpanFull(),

                Select::make('product_id')
                    ->label('Links to product')
                    ->relationship('product', 'title', fn (Builder $query): Builder => $query->orderBy('sort_order'))
                    ->searchable()
                    ->preload()
                    ->placeholder('No link (plain image)')
                    ->helperText('Tapping the slide opens this product. Leave empty for a plain image.'),

                Toggle::make('is_active')
                    ->label('Active')
                    ->default(true)
                    ->inline(false),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('text')
            ->reorderable('sort_order')
            ->defaultSort('sort_order')
            ->columns([
                SpatieMediaLibraryImageColumn::make('image')
                    ->label('Image')
                    ->collection('image')
                    ->conversion('slider'),
                TextColumn::make('text')
                    ->label('Text')
                    ->placeholder('—')
                    ->limit(30)
                    ->wrap(),
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
            ])
            ->filters([
                TernaryFilter::make('is_active')
                    ->label('Active'),
            ])
            ->headerActions([
                CreateAction::make(),
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
