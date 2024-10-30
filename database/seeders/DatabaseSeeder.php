<?php

namespace Database\Seeders;

use App\Models\Permissions;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Tạo người dùng
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'),
            'status' => 1,
        ]);

        User::factory()->create([
            'name' => 'Editor',
            'email' => 'editor@gmail.com',
            'password' => Hash::make('12345678'),
            'status' => 1,
        ]);

        User::factory()->create([
            'name' => 'Sale',
            'email' => 'sale@gmail.com',
            'password' => Hash::make('12345678'),
            'status' => 1,
        ]);

        User::factory()->create([
            'name' => 'Support',
            'email' => 'support@gmail.com',
            'password' => Hash::make('12345678'),
            'status' => 1,
        ]);

        // Tạo vai trò
        Role::create(['name' => 'Super Admin', 'guard_name' => 'web']);
        Role::create(['name' => 'Editor', 'guard_name' => 'web']);
        Role::create(['name' => 'Sale', 'guard_name' => 'web']);
        Role::create(['name' => 'Support', 'guard_name' => 'web']);

        // Tạo quyền
        $permissions = [
            'created_product',
            'show_product',
            'updated_product',
            'delete_product',
            'created_post',
            'show_post',
            'updated_post',
        ];

        foreach ($permissions as $permission) {
            Permissions::create(['name' => $permission, 'guard_name' => 'web']);
        }
    }
}
