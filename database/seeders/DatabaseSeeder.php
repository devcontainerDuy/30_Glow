<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Traits\GeneratesUniqueId;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use GeneratesUniqueId;
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'uid' => $this->generateUUIDv4(),
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password'=> Hash::make('123456'),
        ]);
    }
}
