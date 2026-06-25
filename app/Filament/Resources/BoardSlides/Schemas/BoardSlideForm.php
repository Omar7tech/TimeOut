<?php

namespace App\Filament\Resources\BoardSlides\Schemas;

use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Builder;

class BoardSlideForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Slide')
                    ->description('A slide that can be shown on one or more menu boards.')
                    ->columnSpanFull()
                    ->columns(2)
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

                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->inline(false),

                        // Plain slides (no product) can carry their own weekday
                        // schedule. Product slides follow their product's schedule.
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
                            ->columnSpanFull()
                            ->visibleJs(<<<'JS'
                                ! $get('product_id') && $get('custom_schedule')
                                JS),

                        Select::make('displayScreens')
                            ->label('Shown on boards')
                            ->relationship('displayScreens', 'name')
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->helperText('Attach this slide to any number of menu boards.')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
