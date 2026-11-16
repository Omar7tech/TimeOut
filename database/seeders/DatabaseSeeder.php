<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application with the live Time Out Snack menu: its categories,
     * products, photos, carousel and shop settings. Every menu seeder only
     * adds what is missing, so it is safe to run on a server that already
     * has the menu.
     *
     * Model events stay on: category and product slugs go through
     * spatie/laravel-sluggable on `creating`, which keeps the live slugs given.
     */
    public function run(): void
    {
        User::updateOrCreate([
            'email' => 'admin@timeout.com',
        ], [
            'name' => 'Admin',
            'email' => 'admin@timeout.com',
            'password' => bcrypt('password'),
        ]);

        $this->call([
            GeneralSettingsSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            MenuImageSeeder::class,
            SlideSeeder::class,
        ]);
    }
}
