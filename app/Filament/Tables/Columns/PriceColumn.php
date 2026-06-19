<?php

namespace App\Filament\Tables\Columns;

use Closure;
use Filament\Tables\Columns\Column;

class PriceColumn extends Column
{
    protected string $view = 'filament.tables.columns.price-column';

    protected float|Closure|null $lbpRate = null;

    /**
     * The LBP exchange rate (LBP per 1 USD) used to display converted prices.
     * Pass null to hide LBP prices entirely.
     */
    public function lbpRate(float|Closure|null $rate): static
    {
        $this->lbpRate = $rate;

        return $this;
    }

    public function getLbpRate(): ?float
    {
        return $this->evaluate($this->lbpRate);
    }
}
