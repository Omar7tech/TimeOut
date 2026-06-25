<?php

namespace App\Filament\Resources\DisplayScreens;

use App\Filament\Resources\DisplayScreens\Pages\CreateDisplayScreen;
use App\Filament\Resources\DisplayScreens\Pages\EditDisplayScreen;
use App\Filament\Resources\DisplayScreens\Pages\ListDisplayScreens;
use App\Filament\Resources\DisplayScreens\RelationManagers\SlidesRelationManager;
use App\Filament\Resources\DisplayScreens\Schemas\DisplayScreenForm;
use App\Filament\Resources\DisplayScreens\Tables\DisplayScreensTable;
use App\Models\DisplayScreen;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class DisplayScreenResource extends Resource
{
    protected static ?string $model = DisplayScreen::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTv;

    protected static ?string $navigationLabel = 'Menu Boards';

    protected static ?string $modelLabel = 'Menu Board';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return DisplayScreenForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DisplayScreensTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            SlidesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListDisplayScreens::route('/'),
            'create' => CreateDisplayScreen::route('/create'),
            'edit' => EditDisplayScreen::route('/{record}/edit'),
        ];
    }
}
