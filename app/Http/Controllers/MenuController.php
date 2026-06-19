<?php

namespace App\Http\Controllers;

use App\Enums\OrderType;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function dineIn(): Response
    {
        return $this->renderMenu(OrderType::DINE_IN);
    }

    public function delivery(): Response
    {
        return $this->renderMenu(OrderType::TAKEAWAY);
    }

    /**
     * Render the shared menu page. The order type only affects cart behaviour;
     * the layout is identical for both menus.
     */
    private function renderMenu(OrderType $orderType): Response
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->with([
                'media',
                'products' => $this->productsConstraint($orderType),
            ])
            ->orderBy('sort_order')
            ->get()
            // Drop categories that have no products available right now.
            ->filter(fn (Category $category): bool => $category->products->isNotEmpty())
            ->values();

        return Inertia::render('menu', [
            'orderType' => $orderType->value,
            'orderTypeLabel' => $orderType->getLabel(),
            'categories' => CategoryResource::collection($categories)->resolve(),
        ]);
    }

    /**
     * Eager-loading constraint limiting a category's products to the items that
     * are orderable and available right now: active, of the correct order type,
     * and either unscheduled or scheduled for today.
     *
     * @return \Closure(Relation<*, *, *>): void
     */
    private function productsConstraint(OrderType $orderType): \Closure
    {
        return function (Relation $query) use ($orderType): void {
            $query
                ->with('media')
                ->where('is_active', true)
                ->whereIn('order_type', [$orderType->value, OrderType::BOTH->value])
                ->where(fn (Builder $available): Builder => $available
                    ->where('has_schedule', false)
                    ->orWhereJsonContains('available_days', now()->dayOfWeekIso))
                ->orderBy('sort_order');
        };
    }
}
