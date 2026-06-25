<?php

namespace App\Filament\Resources\DisplayScreens\RelationManagers;

use Filament\Actions\AttachAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DetachAction;
use Filament\Actions\DetachBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\CheckboxList;
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
                    ->helperText('Tapping the slide opens this product. Leave empty for a plain image.')
                    ->live(),

                // Plain slides (no product) can carry their own weekday schedule.
                // Product slides instead follow their product's own schedule.
                Toggle::make('custom_schedule')
                    ->label('Limit to specific days')
                    ->helperText('When off, this slide always shows.')
                    ->live()
                    ->visibleJs(<<<'JS'
                        ! $get('product_id')
                        JS),

                CheckboxList::make('available_days')
                    ->label('Show on days')
                    ->options([
                        1 => 'Monday',
                        2 => 'Tuesday',
                        3 => 'Wednesday',
                        4 => 'Thursday',
                        5 => 'Friday',
                        6 => 'Saturday',
                        7 => 'Sunday',
                    ])
                    ->columns(2)
                    ->bulkToggleable()
                    ->requiredIf('custom_schedule', true)
                    ->visibleJs(<<<'JS'
                        ! $get('product_id') && $get('custom_schedule')
                        JS),

                Toggle::make('is_active')
                    ->label('Active')
                    ->default(true)
                    ->inline(false),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
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
                    ->state(fn ($record): ?string => match (true) {
                        (bool) $record->product?->has_schedule => 'Auto Scheduled',
                        (bool) $record->custom_schedule => 'Scheduled',
                        default => null,
                    }),
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
                // Reuse a slide that already exists on another board.
                AttachAction::make()
                    ->label('Attach existing slide')
                    ->multiple()
                    ->preloadRecordSelect()
                    ->recordSelectOptionsQuery(fn (Builder $query): Builder => $query->with('product'))
                    ->recordSelectSearchColumns(['text']),
            ])
            ->recordActions([
                EditAction::make(),
                // Detach removes the slide from this board only; delete removes
                // the shared slide everywhere.
                DetachAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DetachBulkAction::make(),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
