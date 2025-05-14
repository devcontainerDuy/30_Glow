<?php

namespace App\Repository\Users;

use App\Models\Role;
use App\Repository\EloquentRepository;

class UserRepository extends EloquentRepository implements UserRepositoryInterface
{
    /**
     * UserRepository constructor.
     */
    public function getModel(): string
    {
        return \App\Models\User::class;
    }

    public function getAllUsers(): array
    {
        $user = $this->model->with('roles')->cursorPaginate(20);
        $role = Role::select(['id', 'name'])->get();

        return [
            'users' => $user,
            'roles' => $role,
        ];
    }
}
