<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Enums\OrderType;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Repeater\TableColumn;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Details')
                    ->description('Basic information about the product.')
                    ->columnSpanFull()
                    ->columns(2)
                    ->components([
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

                Section::make('Pricing & status')
                    ->columnSpanFull()
                    ->columns(2)
                    ->components([
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

                Section::make('Variants')
                    ->description('Optional priced variants with a name and price.')
                    ->columnSpanFull()
                    ->components([
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
            ]);
    }
}
