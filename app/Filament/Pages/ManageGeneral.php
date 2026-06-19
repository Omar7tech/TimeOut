<?php

namespace App\Filament\Pages;

use App\Enums\PriceDisplay;
use App\Settings\GeneralSettings;
use BackedEnum;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Pages\SettingsPage;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class ManageGeneral extends SettingsPage
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string $settings = GeneralSettings::class;

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('LBP Pricing')
                    ->description('Configure whether prices are also shown in Lebanese Pounds.')
                    ->icon(Heroicon::OutlinedCurrencyDollar)
                    ->schema([
                        Toggle::make('show_lbp_prices')
                            ->label('Enable LBP pricing')
                            ->helperText('Turn on to allow prices to be displayed in Lebanese Pounds.')
                            ->live()
                            ->afterStateUpdated(function (bool $state, callable $set): void {
                                // Fall back to USD-only when LBP pricing is turned off.
                                if (! $state) {
                                    $set('price_display', PriceDisplay::USD->value);
                                }
                            }),
                        TextInput::make('lbp_exchange_rate')
                            ->label('LBP exchange rate')
                            ->helperText('Amount of LBP per 1 USD.')
                            ->numeric()
                            ->minValue(0)
                            ->suffix('LBP')
                            ->live(onBlur: true)
                            ->requiredIf('show_lbp_prices', true)
                            ->visibleJs(<<<'JS'
                                $get('show_lbp_prices')
                                JS),
                    ]),

                Section::make('Price Display')
                    ->description('Choose which currency the storefront prices are shown in.')
                    ->icon(Heroicon::OutlinedBanknotes)
                    ->schema([
                        Radio::make('price_display')
                            ->hiddenLabel()
                            ->options(PriceDisplay::class)
                            ->default(PriceDisplay::USD->value)
                            ->helperText('LBP and Both require LBP pricing to be enabled with a valid exchange rate.')
                            ->disableOptionWhen(function (string $value, Get $get): bool {
                                // Only USD is available unless LBP pricing is enabled with a rate.
                                $lbpReady = $get('show_lbp_prices') && (float) $get('lbp_exchange_rate') > 0;

                                return $value !== PriceDisplay::USD->value && ! $lbpReady;
                            }),
                    ]),
            ]);
    }
}
