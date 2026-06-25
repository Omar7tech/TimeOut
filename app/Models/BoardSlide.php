<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * A single slide belonging to a Menu Board: a wide promotional image that may
 * optionally link to a product, opening that product's details when tapped.
 */
#[Guarded(['id'])]
class BoardSlide extends Model implements HasMedia
{
    use InteractsWithMedia;

    /**
     * The boards this slide is shown on. A slide can be shared across many.
     *
     * @return BelongsToMany<DisplayScreen, $this>
     */
    public function displayScreens(): BelongsToMany
    {
        return $this->belongsToMany(DisplayScreen::class)->withPivot('sort_order');
    }

    /**
     * The product this slide links to, or null for a plain image slide.
     *
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')
            ->singleFile()
            ->useDisk('public');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        // A wide, high-quality conversion sized for the full-bleed carousel.
        $this->addMediaConversion('slider')
            ->nonQueued()
            ->format('webp')
            ->quality(80)
            ->fit(Fit::Max, 1600, 900);
    }

    /**
     * A human-readable label for the slide, used in admin lists where a slide
     * has no caption of its own.
     *
     * @return Attribute<string, never>
     */
    protected function title(): Attribute
    {
        return Attribute::get(fn (): string => $this->text
            ?: ($this->product_id !== null ? $this->product->title : 'Slide #'.$this->id));
    }

    /**
     * The ISO weekdays (1=Mon .. 7=Sun) a plain slide is shown on.
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
     * Whether a plain (non-product) slide should show at the given moment.
     *
     * Product-linked slides follow their product's own availability, so this
     * only governs plain slides: one without a custom schedule always shows;
     * otherwise the moment's weekday must be one of its chosen days.
     */
    public function isScheduledNow(?CarbonInterface $moment = null): bool
    {
        if (! $this->custom_schedule) {
            return true;
        }

        $moment ??= now();

        return in_array($moment->dayOfWeekIso, $this->available_days ?? [], true);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'custom_schedule' => 'boolean',
        ];
    }
}
