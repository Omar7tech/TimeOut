<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Repeater\TableColumn;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Details')
                    ->description('Basic information about the category.')
                    ->columnSpanFull()
                    ->columns(2)
                    ->components([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('subtitle')
                            ->maxLength(255),
                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->inline(false),
                        Textarea::make('description')
                            ->rows(3)
                            ->columnSpanFull(),
                        SpatieMediaLibraryFileUpload::make('image')
                            ->collection('image')
                            ->disk('public')
                            ->visibility('public')
                            ->image()
                            ->imageEditor()
                            ->columnSpanFull(),
                    ]),

                Section::make('Add-ons')
                    ->description('Optional extras with a name and price.')
                    ->columnSpanFull()
                    ->components([
                        Repeater::make('addons')
                            ->hiddenLabel()
                            ->table([
                                TableColumn::make('Name')->markAsRequired(),
                                TableColumn::make('Price')->markAsRequired(),
                            ])
                            ->compact()
                            ->addActionLabel('Add add-on')
                            ->reorderable()
                            ->schema([
                                TextInput::make('name')
                                    ->required()
                                    ->maxLength(255),
                                TextInput::make('price')
                                    ->required()
                                    ->numeric()
                                    ->minValue(0),
                            ]),
                    ]),
            ]);
    }
}
