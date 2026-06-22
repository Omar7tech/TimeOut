<?php

namespace App\Filament\Pages;

use App\Enums\BannerMode;
use App\Enums\PriceDisplay;
use App\Enums\ShopStatusMode;
use App\Enums\SocialPlatform;
use App\Enums\Weekday;
use App\Settings\GeneralSettings;
use BackedEnum;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TimePicker;
use Filament\Forms\Components\Toggle;
use Filament\Pages\SettingsPage;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
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
                Tabs::make()
                    ->columnSpanFull()
                    ->tabs([
                        Tab::make('Shop Status - حالة المحل')
                            ->icon(Heroicon::OutlinedBuildingStorefront)
                            ->schema([
                                Radio::make('status_mode')
                                    ->label('Status mode - وضع الحالة')
                                    ->validationAttribute('status mode')
                                    ->options(ShopStatusMode::class)
                                    ->default(ShopStatusMode::MANUAL->value)
                                    ->required()
                                    ->columnSpanFull(),

                                Toggle::make('is_open')
                                    ->label('Shop is open - المحل مفتوح')
                                    ->helperText('Turn off to switch the storefront to the closed logo. - أطفئه لإظهار شعار "مغلق" في الواجهة.')
                                    ->default(true)
                                    ->columnSpanFull()
                                    ->visibleJs(<<<'JS'
                                        $get('status_mode') === 'manual'
                                        JS),

                                Repeater::make('opening_hours')
                                    ->label('Weekly opening hours - ساعات العمل الأسبوعية')
                                    ->helperText('The shop opens and closes automatically based on these hours. - يفتح المحل ويغلق تلقائيًا بناءً على هذه الساعات.')
                                    ->default(GeneralSettings::defaultOpeningHours())
                                    ->addable(false)
                                    ->deletable(false)
                                    ->reorderable(false)
                                    ->columnSpanFull()
                                    ->itemLabel(fn (array $state): ?string => Weekday::tryFrom($state['day'] ?? -1)?->getLabel())
                                    ->schema([
                                        Hidden::make('day'),

                                        Toggle::make('is_closed')
                                            ->label('Closed (day off) - مغلق (يوم عطلة)')
                                            ->default(false)
                                            ->columnSpanFull(),

                                        TimePicker::make('opens_at')
                                            ->label('Opens at - يفتح الساعة')
                                            ->validationAttribute('opening time')
                                            ->seconds(false)
                                            ->default('09:00')
                                            ->required()
                                            ->columnSpanFull()
                                            ->visibleJs(<<<'JS'
                                                ! $get('is_closed')
                                                JS),

                                        TimePicker::make('closes_at')
                                            ->label('Closes at - يغلق الساعة')
                                            ->validationAttribute('closing time')
                                            ->seconds(false)
                                            ->default('17:00')
                                            ->required()
                                            ->columnSpanFull()
                                            ->visibleJs(<<<'JS'
                                                ! $get('is_closed')
                                                JS),
                                    ])
                                    ->visibleJs(<<<'JS'
                                        $get('status_mode') === 'automatic'
                                        JS),
                            ]),

                        Tab::make('Banner - الشريط')
                            ->icon(Heroicon::OutlinedMegaphone)
                            ->schema([
                                Toggle::make('show_banner')
                                    ->label('Show banner - إظهار الشريط')
                                    ->helperText('This will show above the header in the menu. - يظهر هذا أعلى الهيدر في القائمة.')
                                    ->default(false)
                                    ->columnSpanFull(),

                                Radio::make('banner_mode')
                                    ->label('Banner mode - وضع الشريط')
                                    ->validationAttribute('banner mode')
                                    ->options(BannerMode::class)
                                    ->default(BannerMode::FIXED->value)
                                    ->required()
                                    ->columnSpanFull()
                                    ->visibleJs(<<<'JS'
                                        $get('show_banner')
                                        JS),

                                TextInput::make('banner_text')
                                    ->label('Banner text - نص الشريط')
                                    ->validationAttribute('banner text')
                                    ->default('Welcome To Time Out Snack')
                                    ->requiredIf('show_banner', true)
                                    ->maxLength(255)
                                    ->columnSpanFull()
                                    ->visibleJs(<<<'JS'
                                        $get('show_banner') && $get('banner_mode') === 'fixed'
                                        JS),

                                Repeater::make('banner_schedule')
                                    ->label('Daily banner sentences - جمل الشريط اليومية')
                                    ->helperText('Each day shows its own sentence automatically. - يظهر لكل يوم جملته الخاصة تلقائيًا.')
                                    ->default(GeneralSettings::defaultBannerSchedule())
                                    ->addable(false)
                                    ->deletable(false)
                                    ->reorderable(false)
                                    ->columnSpanFull()
                                    ->itemLabel(fn (array $state): ?string => Weekday::tryFrom($state['day'] ?? -1)?->getLabel())
                                    ->schema([
                                        Hidden::make('day'),

                                        TextInput::make('text')
                                            ->label('Sentence - الجملة')
                                            ->validationAttribute('sentence')
                                            ->default('Welcome To Time Out Snack')
                                            ->maxLength(255)
                                            ->columnSpanFull(),
                                    ])
                                    ->visibleJs(<<<'JS'
                                        $get('show_banner') && $get('banner_mode') === 'scheduled'
                                        JS),
                            ]),

                        Tab::make('Delivery - التوصيل')
                            ->icon(Heroicon::OutlinedTruck)
                            ->schema([
                                Toggle::make('charge_delivery')
                                    ->label('Charge delivery - احتساب رسوم التوصيل')
                                    ->helperText('Adds a delivery charge to the cart total on the takeaway menu. - يضيف رسوم توصيل إلى إجمالي السلة في قائمة التيك أواي.')
                                    ->default(false)
                                    ->columnSpanFull(),

                                TextInput::make('delivery_fee')
                                    ->label('Delivery charge - رسوم التوصيل')
                                    ->validationAttribute('delivery charge')
                                    ->helperText('Amount in USD. - المبلغ بالدولار.')
                                    ->numeric()
                                    ->minValue(0)
                                    ->prefix('$')
                                    ->default(3)
                                    ->requiredIf('charge_delivery', true)
                                    ->columnSpanFull()
                                    ->visibleJs(<<<'JS'
                                        $get('charge_delivery')
                                        JS),
                            ]),

                        Tab::make('LBP Pricing - التسعير بالليرة اللبنانية')
                            ->icon(Heroicon::OutlinedCurrencyDollar)
                            ->schema([
                                Toggle::make('show_lbp_prices')
                                    ->label('Enable LBP pricing - تفعيل التسعير بالليرة')
                                    ->validationAttribute('enable LBP pricing')
                                    ->helperText('Turn on to allow prices to be displayed in Lebanese Pounds. - فعّله للسماح بعرض الأسعار بالليرة اللبنانية.')
                                    ->columnSpanFull()
                                    ->live()
                                    ->afterStateUpdated(function (bool $state, callable $set): void {
                                        // Fall back to USD-only when LBP pricing is turned off.
                                        if (! $state) {
                                            $set('price_display', PriceDisplay::USD->value);
                                        }
                                    }),
                                TextInput::make('lbp_exchange_rate')
                                    ->label('LBP exchange rate - سعر صرف الليرة')
                                    ->validationAttribute('LBP exchange rate')
                                    ->helperText('Amount of LBP per 1 USD. - قيمة الليرة اللبنانية مقابل 1 دولار.')
                                    ->numeric()
                                    ->minValue(0)
                                    ->suffix('LBP')
                                    ->columnSpanFull()
                                    ->live(onBlur: true)
                                    ->requiredIf('show_lbp_prices', true)
                                    ->visibleJs(<<<'JS'
                                        $get('show_lbp_prices')
                                        JS),
                            ]),

                        Tab::make('Price Display - عرض الأسعار')
                            ->icon(Heroicon::OutlinedBanknotes)
                            ->schema([
                                Radio::make('price_display')
                                    ->label('Price display - عرض الأسعار')
                                    ->options(PriceDisplay::class)
                                    ->default(PriceDisplay::USD->value)
                                    ->helperText('LBP and Both require LBP pricing to be enabled with a valid exchange rate. - خيارا "الليرة" و"كلاهما" يتطلبان تفعيل التسعير بالليرة مع سعر صرف صالح.')
                                    ->columnSpanFull()
                                    ->disableOptionWhen(function (string $value, Get $get): bool {
                                        // Only USD is available unless LBP pricing is enabled with a rate.
                                        $lbpReady = $get('show_lbp_prices') && (float) $get('lbp_exchange_rate') > 0;

                                        return $value !== PriceDisplay::USD->value && ! $lbpReady;
                                    }),
                            ]),

                        Tab::make('Online Ordering - الطلب أونلاين')
                            ->icon(Heroicon::OutlinedShoppingBag)
                            ->schema([
                                Toggle::make('online_ordering_active')
                                    ->label('Online ordering active - تفعيل الطلب أونلاين')
                                    ->helperText('Turn on to let customers send their orders to WhatsApp. - فعّله للسماح للزبائن بإرسال طلباتهم عبر واتساب.')
                                    ->default(true)
                                    ->columnSpanFull(),

                                TextInput::make('whatsapp_number')
                                    ->label('WhatsApp number - رقم واتساب')
                                    ->validationAttribute('WhatsApp number')
                                    ->helperText('Orders are sent to this number. Include the country code. - تُرسل الطلبات إلى هذا الرقم. أدخل رمز الدولة.')
                                    ->tel()
                                    ->default('+9613150099')
                                    ->maxLength(255)
                                    ->requiredIf('online_ordering_active', true)
                                    ->columnSpanFull()
                                    ->visibleJs(<<<'JS'
                                        $get('online_ordering_active')
                                        JS),

                                Toggle::make('require_full_name')
                                    ->label('Require full name - طلب الاسم الكامل')
                                    ->helperText('Ask the customer for their name before sending the order. - اطلب اسم الزبون قبل إرسال الطلب.')
                                    ->default(false)
                                    ->columnSpanFull()
                                    ->visibleJs(<<<'JS'
                                        $get('online_ordering_active')
                                        JS),

                                Toggle::make('get_client_location')
                                    ->label('Get customer location - تحديد موقع الزبون')
                                    ->helperText('Ask for the customer\'s location and attach a map link to the order. - اطلب موقع الزبون وأرفق رابط الخريطة مع الطلب.')
                                    ->default(false)
                                    ->columnSpanFull()
                                    ->visibleJs(<<<'JS'
                                        $get('online_ordering_active')
                                        JS),
                            ]),

                        Tab::make('Social - التواصل')
                            ->icon(Heroicon::OutlinedShare)
                            ->schema([
                                Repeater::make('social_links')
                                    ->label('Social media links - روابط مواقع التواصل')
                                    ->helperText('These appear in the storefront footer. Each platform can be added once. - تظهر هذه في تذييل الواجهة. يمكن إضافة كل منصة مرة واحدة.')
                                    ->addActionLabel('Add link - إضافة رابط')
                                    ->maxItems(count(SocialPlatform::cases()))
                                    ->columnSpanFull()
                                    ->itemLabel(function (array $state): ?string {
                                        $platform = $state['platform'] ?? null;

                                        if ($platform instanceof SocialPlatform) {
                                            return $platform->getLabel();
                                        }

                                        return is_string($platform) ? SocialPlatform::tryFrom($platform)?->getLabel() : null;
                                    })
                                    ->schema([
                                        Select::make('platform')
                                            ->label('Platform - المنصة')
                                            ->validationAttribute('platform')
                                            ->options(SocialPlatform::class)
                                            ->required()
                                            ->disableOptionsWhenSelectedInSiblingRepeaterItems()
                                            ->columnSpanFull(),

                                        TextInput::make('url')
                                            ->label('Link - الرابط')
                                            ->validationAttribute('link')
                                            ->url()
                                            ->required()
                                            ->maxLength(255)
                                            ->columnSpanFull(),
                                    ]),
                            ]),
                    ]),
            ]);
    }
}
