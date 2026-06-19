<?php

namespace App\Filament\Resources\Categories\Pages;

use App\Filament\Resources\Categories\CategoryResource;
use App\Filament\Resources\Products\ProductResource;
use App\Models\Product;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ManageCategoryProducts extends ManageRelatedRecords
{
    protected static string $resource = CategoryResource::class;

    protected static string $relationship = 'products';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShoppingBag;

    public static function getNavigationLabel(): string
    {
        return 'Products';
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All'),
            'scheduled' => Tab::make('Scheduled')
                ->modifyQueryUsing(fn (Builder $query): Builder => $query->where('has_schedule', true)),
            'unscheduled' => Tab::make('Always available')
                ->modifyQueryUsing(fn (Builder $query): Builder => $query->where('has_schedule', false)),
        ];
    }

    public function form(Schema $schema): Schema
    {
        return ProductResource::form($schema);
    }

    public function table(Table $table): Table
    {
        return ProductResource::table($table)
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                ViewAction::make()
                    ->url(fn (Product $record): string => ProductResource::getUrl('view', ['record' => $record])),
                EditAction::make()
                    ->url(fn (Product $record): string => ProductResource::getUrl('edit', ['record' => $record])),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
