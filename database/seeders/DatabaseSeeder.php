<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Traits\GeneratesUniqueId;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use GeneratesUniqueId;
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PermissionsSeeder::class);
        $permissions = PermissionsSeeder::$valuePermissions;

        $role = Role::create(["name" => "super-admin", "guard_name" => "web"])->syncPermissions($permissions);
        User::create([
            'uid' => $this->generateUUIDv4(),
            'name' => 'Admin',
            'email' => '3Bc8o@example.com',
            'password' => Hash::make('123456'),
        ])->assignRole($role);

        $this->call([
            UsersSeeder::class,
            RolesSeeder::class,
        ]);

    }
}
