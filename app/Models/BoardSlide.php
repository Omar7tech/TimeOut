<?php

namespace App\Models;

use Database\Factories\BoardSlideFactory;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
    /** @use HasFactory<BoardSlideFactory> */
    use HasFactory, InteractsWithMedia;

    /**
     * The board this slide is shown on.
     *
     * @return BelongsTo<DisplayScreen, $this>
     */
    public function displayScreen(): BelongsTo
    {
        return $this->belongsTo(DisplayScreen::class);
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
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
