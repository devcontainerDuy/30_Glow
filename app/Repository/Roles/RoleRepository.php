<?php

namespace App\Repository\Roles;

use App\Repository\EloquentRepository;



class RoleRepository extends EloquentRepository implements RoleRepositoryInterface 
{   
    public function getModel(): string{
        return \Spatie\Permission\Models\Role::class;
    }
}