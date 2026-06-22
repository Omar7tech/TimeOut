<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'subtitle' => $this->subtitle,
            'description' => $this->description,
            'price' => (float) $this->price,
            'discount_price' => $this->discount_price !== null ? (float) $this->discount_price : null,
            'order_type' => $this->order_type->value,
            'preparation_time' => $this->preparation_time,
            'is_featured' => (bool) $this->is_featured,
            'is_spicy' => (bool) $this->is_spicy,
            'is_vegan' => (bool) $this->is_vegan,
            'variants' => $this->variants,
            'available_today' => $this->has_schedule
                && in_array(now()->dayOfWeekIso, $this->available_days ?? [], true),
            'image' => $this->getFirstMediaUrl('image', 'webp') ?: null,
            'thumb' => $this->getFirstMediaUrl('image', 'thumb') ?: null,
        ];
    }
}
