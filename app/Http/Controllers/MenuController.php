<?php

namespace App\Http\Controllers;

use App\Enums\OrderType;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\SlideResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\Slide;
use App\Settings\GeneralSettings;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
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

        $settings = app(GeneralSettings::class);

        return Inertia::render('menu', [
            'orderType' => $orderType->value,
            'orderTypeLabel' => $orderType->getLabel(),
            'categories' => CategoryResource::collection($categories)->resolve(),
            'slides' => SlideResource::collection($this->activeSlides())->resolve(),
            'showSchedule' => $settings->show_product_schedule,
            'cardDesign' => $settings->product_card_design->value,
            // The weekly schedule is only built (and queried) when the feature is on.
            'schedule' => $settings->show_product_schedule
                ? $this->weeklySchedule($orderType)
                : null,
        ]);
    }

    /**
     * The active carousel slides in display order, with the linked product (and
     * its category, for add-ons) eager-loaded for the storefront slider.
     *
     * @return Collection<int, Slide>
     */
    private function activeSlides(): Collection
    {
        return Slide::query()
            ->where('is_active', true)
            ->with(['media', 'product.media', 'product.category'])
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * The scheduled products grouped by ISO weekday (1 = Monday .. 7 = Sunday),
     * so the storefront can show what's available on each day of the week.
     *
     * @return array<int, array{day: int, products: array<int, array<string, mixed>>}>
     */
    private function weeklySchedule(OrderType $orderType): array
    {
        $products = Product::query()
            ->where('is_active', true)
            ->where('has_schedule', true)
            ->whereIn('order_type', [$orderType->value, OrderType::BOTH->value])
            ->whereHas('category', fn (Builder $category): Builder => $category->where('is_active', true))
            ->with('media')
            ->orderBy('sort_order')
            ->get();

        return array_map(static fn (int $isoDay): array => [
            'day' => $isoDay,
            'products' => ProductResource::collection(
                $products->filter(fn (Product $product): bool => in_array($isoDay, $product->available_days ?? [], true))
            )->resolve(),
        ], range(1, 7));
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
