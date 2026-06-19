<?php

namespace App\Models;

use App\Enums\OrderType;
use Carbon\CarbonInterface;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        'has_schedule' => 'boolean',
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
     * The ISO weekdays (1=Mon .. 7=Sun) the product is available on.
     *
     * Stored as a JSON array of integers so weekday lookups stay type-safe.
     *
     * @return Attribute<list<int>|null, list<int>|null>
     */
    protected function availableDays(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value): ?array => $value === null
                ? null
                : array_values(array_map(intval(...), json_decode($value, true))),
            set: function (?array $value): ?string {
                if ($value === null) {
                    return null;
                }

                $encoded = json_encode(array_values(array_map(intval(...), $value)));

                return $encoded === false ? null : $encoded;
            },
        );
    }

    /**
     * Limit to products available at the given moment (defaults to now).
     *
     * A product with no schedule is always available; otherwise the moment's
     * weekday must be one of its available days.
     *
     * @param  Builder<Product>  $query
     */
    #[Scope]
    protected function availableNow(Builder $query, ?CarbonInterface $moment = null): void
    {
        $moment ??= now();

        $query->where('is_active', true)->where(function (Builder $query) use ($moment): void {
            $query
                ->where('has_schedule', false)
                ->orWhere(fn (Builder $scheduled) => $scheduled
                    ->where('has_schedule', true)
                    ->whereJsonContains('available_days', $moment->dayOfWeekIso));
        });
    }

    /**
     * Convenience accessor for a single loaded model.
     */
    public function isAvailableNow(?CarbonInterface $moment = null): bool
    {
        $moment ??= now();

        if (! $this->is_active) {
            return false;
        }

        if (! $this->has_schedule) {
            return true;
        }

        return in_array($moment->dayOfWeekIso, $this->available_days ?? [], true);
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
