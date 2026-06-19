<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MenuController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/categories/dine-in', [CategoryController::class, 'dineIn'])->name('categories.dine-in');
Route::get('/categories/delivery', [CategoryController::class, 'delivery'])->name('categories.delivery');

Route::get('/menu/dine-in', [MenuController::class, 'dineIn'])->name('menu.dine-in');
Route::get('/menu/delivery', [MenuController::class, 'delivery'])->name('menu.delivery');
