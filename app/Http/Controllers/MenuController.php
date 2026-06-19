<?php

namespace App\Http\Controllers;

use App\Enums\OrderType;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
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
            ->get();

        return Inertia::render('menu', [
            'orderType' => $orderType->value,
            'orderTypeLabel' => $orderType->getLabel(),
            'categories' => CategoryResource::collection($categories)->resolve(),
        ]);
    }

    /**
     * Eager-loading constraint limiting a category's products to the active
     * items that are orderable for the given order type.
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
                ->orderBy('sort_order');
        };
    }
}
