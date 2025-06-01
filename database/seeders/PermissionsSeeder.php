<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsSeeder extends Seeder
{
    public static $valuePermissions = [];

    public $data = [
        [
            'name' => 'read-users',
            'guard_name' => 'web',
        ],
        [
            'name' => 'view-users',
            'guard_name' => 'web',
        ],
        [
            'name' => 'create-users',
            'guard_name' => 'web',
        ],
        [
            'name' => 'update-users',
            'guard_name' => 'web',
        ],
        [
            'name' => 'delete-users',
            'guard_name' => 'web',
        ],
        [
            'name' => 'restore-users',
            'guard_name' => 'web',
        ],
        [
            'name' => 'force-delete-users',
            'guard_name' => 'web',
        ],
        [
            'name' => 'read-roles',
            'guard_name' => 'web',
        ],
        [
            'name' => 'view-roles',
            'guard_name' => 'web',
        ],
        [
            'name' => 'create-roles',
            'guard_name' => 'web',
        ],
        [
            'name' => 'update-roles',
            'guard_name' => 'web',
        ],
        [
            'name' => 'delete-roles',
            'guard_name' => 'web',
        ],
        [
            'name' => 'restore-roles',
            'guard_name' => 'web',
        ],
        [
            'name' => 'force-delete-roles',
            'guard_name' => 'web',
        ],
        [
            'name' => 'read-permissions',
            'guard_name' => 'web',
        ],
        [
            'name' => 'view-permissions',
            'guard_name' => 'web',
        ],
        [
            'name' => 'create-permissions',
            'guard_name' => 'web',
        ],
        [
            'name' => 'update-permissions',
            'guard_name' => 'web',
        ],
        [
            'name' => 'delete-permissions',
            'guard_name' => 'web',
        ],
        [
            'name' => 'restore-permissions',
            'guard_name' => 'web',
        ],
        [
            'name' => 'force-delete-permissions',
            'guard_name' => 'web',
        ],
    ];
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->data as $item) {
            self::$valuePermissions[] = Permission::create($item);
        }

        // for ($i = 0; $i < 10; $i++) {
        //     self::$valuePermissions[] = Permission::create([
        //         'name' => fake()->unique()->name(),
        //         'guard_name' => 'web',
        //     ]);
        // }
    }
}
