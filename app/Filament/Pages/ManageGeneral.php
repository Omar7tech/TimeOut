<?php

namespace App\Filament\Pages;

use App\Settings\GeneralSettings;
use BackedEnum;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Pages\SettingsPage;
use Filament\Schemas\Components\Section;
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
                            ->label('Show LBP prices')
                            ->helperText('Enable to display prices converted to Lebanese Pounds.')
                            ->live(),
                        TextInput::make('lbp_exchange_rate')
                            ->label('LBP exchange rate')
                            ->helperText('Amount of LBP per 1 USD.')
                            ->numeric()
                            ->minValue(0)
                            ->suffix('LBP')
                            ->requiredIf('show_lbp_prices', true)
                            ->visibleJs(<<<'JS'
                                $get('show_lbp_prices')
                                JS),
                    ]),
            ]);
    }
}
