<?php

namespace App\Filament\Resources\BoardSlides\Pages;

use App\Filament\Resources\BoardSlides\BoardSlideResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBoardSlides extends ListRecords
{
    protected static string $resource = BoardSlideResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
