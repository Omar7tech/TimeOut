<?php

namespace App\Models;

use App\Enums\ScreenOrientation;
use Database\Factories\DisplayScreenFactory;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\Attributes\Sluggable;

/**
 * A "Menu Board": a Smart TV screen mounted in the restaurant that cycles
 * through its own carousel of slides for customers to read.
 */
#[Sluggable(from: 'name', to: 'slug')]
#[Guarded(['id'])]
class DisplayScreen extends Model
{
    /** @use HasFactory<DisplayScreenFactory> */
    use HasFactory;

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * The slides this screen cycles through, in display order.
     *
     * @return HasMany<BoardSlide, $this>
     */
    public function slides(): HasMany
    {
        return $this->hasMany(BoardSlide::class)->orderBy('sort_order');
    }

    protected $casts = [
        'orientation' => ScreenOrientation::class,
        'rotation_seconds' => 'integer',
        'display_prices' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
