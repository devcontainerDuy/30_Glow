<?php

namespace App\Repository\Permissions;

use App\Repository\EloquentRepository;



class PermissionRepository extends EloquentRepository implements PermissionRepositoryInterface 
{
    public function getModel(): string
    {
        return \Spatie\Permission\Models\Permission::class;
    }
}