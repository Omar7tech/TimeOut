<?php

namespace App\Filament\Resources\BoardSlides\Pages;

use App\Filament\Resources\BoardSlides\BoardSlideResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBoardSlide extends EditRecord
{
    protected static string $resource = BoardSlideResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
