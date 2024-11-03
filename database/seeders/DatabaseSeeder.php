<?php

namespace Database\Seeders;

use App\Models\Permissions;
use App\Models\Role;
use App\Models\User;
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
        // Tạo người dùng
        User::factory()->create([
            'uid' => $this->createCodeUser(),
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'),
            'status' => 1,
        ]);

        User::factory()->create([
            'uid' => $this->createCodeUser(),
            'name' => 'Manager',
            'email' => 'manager@gmail.com',
            'password' => Hash::make('12345678'),
            'status' => 1,
        ]);

        User::factory()->create([
            'uid' => $this->createCodeUser(),
            'name' => 'Staff',
            'email' => 'staff@gmail.com',
            'password' => Hash::make('12345678'),
            'status' => 1,
        ]);

        User::factory()->create([
            'uid' => $this->createCodeUser(),
            'name' => 'Support',
            'email' => 'support@gmail.com',
            'password' => Hash::make('12345678'),
            'status' => 1,
        ]);

        // Tạo vai trò
        Role::create(['name' => 'Super Admin', 'guard_name' => 'web']);
        Role::create(['name' => 'Manager', 'guard_name' => 'web']);
        Role::create(['name' => 'Staff', 'guard_name' => 'web']);
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
