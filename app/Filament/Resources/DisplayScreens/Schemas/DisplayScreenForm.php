<?php

namespace App\Filament\Resources\DisplayScreens\Schemas;

use App\Enums\BoardLayout;
use App\Enums\ScreenOrientation;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class DisplayScreenForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Menu Board')
                    ->description('A Smart TV screen in the restaurant. Add its slides after saving.')
                    ->columnSpanFull()
                    ->columns(2)
                    ->components([
                        TextInput::make('name')
                            ->label('Name')
                            ->helperText('A label to identify this screen, e.g. "Counter Left" or "Drive-thru".')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Select::make('orientation')
                            ->label('Orientation')
                            ->options(ScreenOrientation::class)
                            ->default(ScreenOrientation::LANDSCAPE)
                            ->required(),

                        Select::make('layout')
                            ->label('Display style')
                            ->helperText('How each slide is presented on the screen. Older Smart TVs can use the lightweight "Simple URL" instead, which ignores this style.')
                            ->options(BoardLayout::class)
                            ->default(BoardLayout::SPOTLIGHT)
                            ->native(false)
                            ->required(),

                        TextInput::make('rotation_seconds')
                            ->label('Slide duration (seconds)')
                            ->helperText('How long each slide stays on screen before auto-advancing.')
                            ->numeric()
                            ->minValue(2)
                            ->maxValue(120)
                            ->default(6)
                            ->required(),

                        Toggle::make('display_prices')
                            ->label('Display prices')
                            ->helperText('Show product prices on this board. Turn off for a promo-only screen.')
                            ->default(true)
                            ->inline(false),

                        Toggle::make('show_logo')
                            ->label('Show logo')
                            ->helperText('Overlay the restaurant logo on the screen.')
                            ->default(true)
                            ->inline(false),

                        Toggle::make('auto_refresh')
                            ->label('Auto refresh')
                            ->helperText('Periodically reload the board so it picks up new slides and prices on its own.')
                            ->default(false)
                            ->live()
                            ->inline(false),

                        TextInput::make('auto_refresh_minutes')
                            ->label('Refresh every (minutes)')
                            ->helperText('How often the board reloads itself.')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(1440)
                            ->default(15)
                            ->required(fn (Get $get): bool => (bool) $get('auto_refresh'))
                            ->visible(fn (Get $get): bool => (bool) $get('auto_refresh')),

                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->inline(false),
                    ]),
            ]);
    }
}
