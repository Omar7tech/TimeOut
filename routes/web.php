<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/menu/dine-in', 'menu/dine-in')->name('menu.dine-in');
Route::inertia('/menu/delivery', 'menu/delivery')->name('menu.delivery');
