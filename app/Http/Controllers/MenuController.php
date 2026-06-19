<?php

namespace App\Http\Controllers;

use App\Enums\OrderType;
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
        return Inertia::render('menu', [
            'orderType' => $orderType->value,
            'orderTypeLabel' => $orderType->getLabel(),
        ]);
    }
}
