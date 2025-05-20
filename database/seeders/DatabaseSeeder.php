<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Traits\GeneratesUniqueId;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use GeneratesUniqueId;
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // for ($i = 0; $i < 10; $i++) {
        //     User::create([
        //         'uid' => $this->generateUUIDv4(),
        //         'name' => fake()->name(),
        //         'email' => fake()->unique()->email(),
        //         'password' => Hash::make('123456'),
        //     ]);
        // }

        // for ($i = 0; $i < 10; $i++) {
        //     Role::create([
        //         'name' => fake()->unique()->name(),
        //         'guard_name' => 'web',
        //     ]);
        // }

        // for ($i = 0; $i < 10; $i++) {
        //     Permission::create([
        //         'name' => fake()->unique()->word(),
        //         'guard_name' => 'web',
        //     ]);
        // }
    }
}
