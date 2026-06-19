<?php

namespace App\Models;

use App\Enums\ScheduleType;
use Carbon\CarbonInterface;
use Database\Factories\ProductScheduleFactory;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Guarded(['id'])]
class ProductSchedule extends Model
{
    /** @use HasFactory<ProductScheduleFactory> */
    use HasFactory;

    protected $casts = [
        'type' => ScheduleType::class,
        'day_of_week' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Whether this single rule matches the given moment.
     */
    public function matches(CarbonInterface $moment): bool
    {
        if (! $this->is_active) {
            return false;
        }

        $dateOk = match ($this->type) {
            ScheduleType::RECURRING => $this->day_of_week === $moment->dayOfWeekIso,
            ScheduleType::WINDOW => (! $this->start_date || $moment->gte($this->start_date->startOfDay()))
                && (! $this->end_date || $moment->lte($this->end_date->endOfDay())),
        };

        if (! $dateOk) {
            return false;
        }

        $time = $moment->format('H:i:s');

        return (! $this->start_time || $time >= $this->start_time)
            && (! $this->end_time || $time <= $this->end_time);
    }
}
