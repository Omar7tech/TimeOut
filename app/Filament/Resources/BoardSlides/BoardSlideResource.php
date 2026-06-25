<?php

namespace App\Filament\Resources\BoardSlides;

use App\Filament\Resources\BoardSlides\Pages\CreateBoardSlide;
use App\Filament\Resources\BoardSlides\Pages\EditBoardSlide;
use App\Filament\Resources\BoardSlides\Pages\ListBoardSlides;
use App\Filament\Resources\BoardSlides\Schemas\BoardSlideForm;
use App\Filament\Resources\BoardSlides\Tables\BoardSlidesTable;
use App\Models\BoardSlide;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BoardSlideResource extends Resource
{
    protected static ?string $model = BoardSlide::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = 'Board Slides';

    protected static ?string $modelLabel = 'Board Slide';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return BoardSlideForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BoardSlidesTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBoardSlides::route('/'),
            'create' => CreateBoardSlide::route('/create'),
            'edit' => EditBoardSlide::route('/{record}/edit'),
        ];
    }
}
