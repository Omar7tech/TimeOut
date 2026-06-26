<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
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

        /*  $this->call([
             CategorySeeder::class,
             ProductSeeder::class,
         ]); */
    }
}
