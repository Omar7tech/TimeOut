<?php

namespace App\Models;

use App\Enums\BoardLayout;
use App\Enums\ScreenOrientation;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Sluggable\Attributes\Sluggable;

/**
 * A "Menu Board": a Smart TV screen mounted in the restaurant that cycles
 * through its own carousel of slides for customers to read.
 */
#[Sluggable(from: 'name', to: 'slug')]
#[Guarded(['id'])]
class DisplayScreen extends Model
{
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * The slides this screen cycles through, in per-board display order.
     *
     * Slides are shared: the same slide can belong to several boards, each with
     * its own ordering held on the pivot.
     *
     * @return BelongsToMany<BoardSlide, $this>
     */
    public function slides(): BelongsToMany
    {
        return $this->belongsToMany(BoardSlide::class)
            ->withPivot('sort_order')
            ->orderByPivot('sort_order');
    }

    protected $casts = [
        'orientation' => ScreenOrientation::class,
        'layout' => BoardLayout::class,
        'rotation_seconds' => 'integer',
        'display_prices' => 'boolean',
        'show_logo' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
