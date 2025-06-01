<?php

namespace Database\Seeders;

use App\Models\User;
use App\Traits\GeneratesUniqueId;
use Illuminate\Support\Facades\Hash;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    use GeneratesUniqueId;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        for ($i = 0; $i < 10; $i++) {
            User::create([
                'uid' => $this->generateUUIDv4(),
                'name' => fake()->name(),
                'email' => fake()->unique()->email(),
                'password' => Hash::make('123456'),
            ]);
        }
    }
}
