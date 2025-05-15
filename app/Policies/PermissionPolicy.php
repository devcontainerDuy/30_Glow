<?php

namespace App\Policies;

use App\Models\User;

class PermissionPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function read(User $user)
    {
        return $user->can('read_permission');
    }

    public function show(User $user)
    {
        return $user->can('show_permission');
    }

    public function create(User $user)
    {
        return $user->can('create_permission');
    }

    public function update(User $user)
    {
        return $user->can('update_permission');
    }

    public function delete(User $user)
    {
        return $user->can('delete_permission');
    }
}
