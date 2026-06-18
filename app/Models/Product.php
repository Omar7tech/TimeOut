<?php

namespace App\Models;

use App\Enums\OrderType;
use App\Enums\ScheduleType;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\Attributes\Sluggable;

#[Sluggable(from: 'title', to: 'slug')]
#[Guarded(['id'])]
class Product extends Model implements HasMedia
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory, InteractsWithMedia;

    protected $casts = [
        'order_type' => OrderType::class,
        'variants' => 'array',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<ProductSchedule, $this>
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(ProductSchedule::class);
    }

    /**
     * Limit to products available at the given moment (defaults to now).
     *
     * A product with no active schedule rules is always available.
     * Otherwise it must match at least one rule.
     */
    #[Scope]
    protected function availableNow(Builder $query, ?Carbon $moment = null): void
    {
        $moment ??= now();
        $time = $moment->format('H:i:s');

        $query->where('is_active', true)->where(function (Builder $query) use ($moment, $time): void {
            $query
                ->whereDoesntHave('schedules', fn (Builder $rule) => $rule->where('is_active', true))
                ->orWhereHas('schedules', function (Builder $rule) use ($moment, $time): void {
                    $rule
                        ->where('is_active', true)
                        ->where(function (Builder $rule) use ($moment): void {
                            $rule
                                ->where(fn (Builder $r) => $r
                                    ->where('type', ScheduleType::RECURRING->value)
                                    ->where('day_of_week', $moment->dayOfWeekIso))
                                ->orWhere(fn (Builder $r) => $r
                                    ->where('type', ScheduleType::WINDOW->value)
                                    ->where(fn (Builder $q) => $q->whereNull('start_date')->orWhereDate('start_date', '<=', $moment))
                                    ->where(fn (Builder $q) => $q->whereNull('end_date')->orWhereDate('end_date', '>=', $moment)));
                        })
                        ->where(fn (Builder $q) => $q->whereNull('start_time')->orWhere('start_time', '<=', $time))
                        ->where(fn (Builder $q) => $q->whereNull('end_time')->orWhere('end_time', '>=', $time));
                });
        });
    }

    /**
     * Convenience accessor for a single loaded model.
     */
    public function isAvailableNow(?Carbon $moment = null): bool
    {
        $moment ??= now();

        $activeRules = $this->schedules->where('is_active', true);

        if ($activeRules->isEmpty()) {
            return $this->is_active;
        }

        return $this->is_active && $activeRules->contains(fn (ProductSchedule $rule) => $rule->matches($moment));
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')
            ->singleFile()
            ->useDisk('public');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('webp')
            ->withResponsiveImages()
            ->nonQueued()
            ->format('webp')
            ->quality(40);
    }
}
