<?php

namespace App\Filament\Resources\Products\RelationManagers;

use App\Enums\ScheduleType;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TimePicker;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SchedulesRelationManager extends RelationManager
{
    protected static string $relationship = 'schedules';

    protected static ?string $title = 'Availability schedule';

    private const DAYS = [
        1 => 'Monday',
        2 => 'Tuesday',
        3 => 'Wednesday',
        4 => 'Thursday',
        5 => 'Friday',
        6 => 'Saturday',
        7 => 'Sunday',
    ];

    /**
     * The form state for `type` may be an enum instance (initial/default render)
     * or its backing string (after a live change), so accept both.
     */
    private static function isType(Get $get, ScheduleType $type): bool
    {
        $value = $get('type');

        return $value === $type || $value === $type->value;
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('type')
                    ->label('Schedule type')
                    ->options(ScheduleType::class)
                    ->default(ScheduleType::RECURRING)
                    ->required()
                    ->native(false)
                    ->live()
                    ->columnSpanFull(),

                Select::make('day_of_week')
                    ->label('Day of week')
                    ->options(self::DAYS)
                    ->required()
                    ->native(false)
                    ->visible(fn (Get $get): bool => self::isType($get, ScheduleType::RECURRING)),

                DatePicker::make('start_date')
                    ->label('From date')
                    ->native(false)
                    ->visible(fn (Get $get): bool => self::isType($get, ScheduleType::WINDOW)),

                DatePicker::make('end_date')
                    ->label('To date')
                    ->native(false)
                    ->afterOrEqual('start_date')
                    ->visible(fn (Get $get): bool => self::isType($get, ScheduleType::WINDOW)),

                TimePicker::make('start_time')
                    ->label('From time')
                    ->seconds(false)
                    ->helperText('Leave empty for all day.'),

                TimePicker::make('end_time')
                    ->label('To time')
                    ->seconds(false)
                    ->after('start_time')
                    ->helperText('Leave empty for all day.'),

                Toggle::make('is_active')
                    ->label('Active')
                    ->default(true)
                    ->inline(false)
                    ->columnSpanFull(),
            ])
            ->columns(2);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('type')
            ->columns([
                TextColumn::make('type')
                    ->badge(),
                TextColumn::make('day_of_week')
                    ->label('Day')
                    ->formatStateUsing(fn (?int $state): string => self::DAYS[$state] ?? '—'),
                TextColumn::make('start_date')
                    ->label('From')
                    ->date()
                    ->placeholder('—'),
                TextColumn::make('end_date')
                    ->label('To')
                    ->date()
                    ->placeholder('—'),
                TextColumn::make('start_time')
                    ->label('From time')
                    ->time('H:i')
                    ->placeholder('All day'),
                TextColumn::make('end_time')
                    ->label('To time')
                    ->time('H:i')
                    ->placeholder('All day'),
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->options(ScheduleType::class),
            ])
            ->headerActions([
                CreateAction::make()
                    ->modalHeading('New schedule rule'),
            ])
            ->recordActions([
                EditAction::make()
                    ->modalHeading('Edit schedule rule'),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
