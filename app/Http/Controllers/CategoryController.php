<?php

namespace App\Http\Controllers;

use App\Enums\OrderType;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function dineIn(): Response
    {
        return $this->renderCategories(OrderType::DINE_IN, route('menu.dine-in'));
    }

    public function delivery(): Response
    {
        return $this->renderCategories(OrderType::TAKEAWAY, route('menu.delivery'));
    }

    /**
     * Render the category grid. The categories shown are identical for every
     * order type; only the menu they link to differs.
     */
    private function renderCategories(OrderType $orderType, string $menuUrl): Response
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->with('media')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('categories', [
            'orderType' => $orderType->value,
            'orderTypeLabel' => $orderType->getLabel(),
            'menuUrl' => $menuUrl,
            'categories' => CategoryResource::collection($categories)->resolve(),
        ]);
    }
}
