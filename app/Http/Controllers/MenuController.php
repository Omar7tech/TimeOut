<?php

namespace App\Http\Controllers;

use App\Enums\OrderType;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Settings\GeneralSettings;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function dineIn(): Response
    {
        return $this->renderMenu(OrderType::DINE_IN);
    }

    public function delivery(GeneralSettings $settings): Response|RedirectResponse
    {
        // The delivery menu only exists while online ordering is active; otherwise
        // the shop is dine-in only, so send customers back to the dine-in menu.
        if (! $settings->online_ordering_active) {
            return redirect()->route('menu.dine-in');
        }

        return $this->renderMenu(OrderType::TAKEAWAY);
    }

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
            ->filter(fn (Category $category): bool => $category->products->isNotEmpty())
            ->values();

        return Inertia::render('menu', [
            'orderType' => $orderType->value,
            'orderTypeLabel' => $orderType->getLabel(),
            'categories' => CategoryResource::collection($categories)->resolve(),
        ]);
    }

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
