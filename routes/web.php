<?php

use App\Http\Controllers\DisplayScreenController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\SeoController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/menu/dine-in', [MenuController::class, 'dineIn'])->name('menu.dine-in');
Route::get('/menu/delivery', [MenuController::class, 'delivery'])->name('menu.delivery');

// SEO: crawl rules and sitemap, served dynamically so URLs use the live domain.
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('seo.robots');
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('seo.sitemap');

// Public Menu Board for in-store Smart TVs, addressed by the board's slug.
Route::get('/board/{displayScreen:slug}', [DisplayScreenController::class, 'show'])->name('board.show');
