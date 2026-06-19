<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Enums\OrderType;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Repeater\TableColumn;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make()
                    ->columnSpanFull()
                    ->tabs([
                        Tab::make('Details')
                            ->icon(Heroicon::OutlinedInformationCircle)
                            ->columns(2)
                            ->schema([
                                TextInput::make('title')
                                    ->required()
                                    ->maxLength(255),
                                TextInput::make('subtitle')
                                    ->maxLength(255),
                                Select::make('category_id')
                                    ->relationship('category', 'title')
                                    ->searchable()
                                    ->preload()
                                    ->required(),
                                Select::make('order_type')
                                    ->options(OrderType::class)
                                    ->default(OrderType::BOTH)
                                    ->native(false)
                                    ->required(),
                                Textarea::make('description')
                                    ->rows(3)
                                    ->columnSpanFull(),
                                SpatieMediaLibraryFileUpload::make('image')
                                    ->collection('image')
                                    ->disk('public')
                                    ->visibility('public')
                                    ->image()
                                    ->conversion('webp')
                                    ->responsiveImages()
                                    ->imageEditor()
                                    ->columnSpanFull(),
                            ]),

                        Tab::make('Pricing & status')
                            ->icon(Heroicon::OutlinedCurrencyDollar)
                            ->columns(2)
                            ->schema([
                                TextInput::make('price')
                                    ->required()
                                    ->numeric()
                                    ->minValue(0)
                                    ->prefix('$'),
                                TextInput::make('discount_price')
                                    ->numeric()
                                    ->minValue(0)
                                    ->prefix('$'),
                                TextInput::make('preparation_time')
                                    ->label('Preparation time (minutes)')
                                    ->numeric()
                                    ->minValue(0),
                                TextInput::make('sort_order')
                                    ->numeric()
                                    ->default(0),
                                Toggle::make('is_active')
                                    ->label('Active')
                                    ->default(true)
                                    ->inline(false),
                                Toggle::make('is_featured')
                                    ->label('Featured')
                                    ->default(false)
                                    ->inline(false),
                            ]),

                        Tab::make('Availability')
                            ->icon(Heroicon::OutlinedCalendarDays)
                            ->schema([
                                Toggle::make('has_schedule')
                                    ->label('Limit to specific days')
                                    ->helperText('When off, the product is always available.')
                                    ->live(),
                                CheckboxList::make('available_days')
                                    ->label('Available days')
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
                                    ->requiredIf('has_schedule', true)
                                    ->visibleJs(<<<'JS'
                                        $get('has_schedule')
                                        JS),
                            ]),

                        Tab::make('Variants')
                            ->icon(Heroicon::OutlinedRectangleStack)
                            ->schema([
                                Repeater::make('variants')
                                    ->hiddenLabel()
                                    ->table([
                                        TableColumn::make('Name')->markAsRequired(),
                                        TableColumn::make('Price')->markAsRequired(),
                                        TableColumn::make('Discount price'),
                                    ])
                                    ->compact()
                                    ->addActionLabel('Add variant')
                                    ->reorderable()
                                    ->schema([
                                        TextInput::make('name')
                                            ->required()
                                            ->maxLength(255),
                                        TextInput::make('price')
                                            ->required()
                                            ->numeric()
                                            ->minValue(0),
                                        TextInput::make('discount_price')
                                            ->numeric()
                                            ->minValue(0),
                                    ]),
                            ]),
                    ]),
            ]);
    }
}
