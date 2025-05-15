<?php

namespace App\Policies;

use App\Models\User;

class RolePolicy
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
        return $user->can('read_role');
    }

    public function show(User $user)
    {
        return $user->can('show_role');
    }

    public function create(User $user)
    {
        return $user->can('create_role');
    }

    public function update(User $user)
    {
        return $user->can('update_role');
    }

    public function delete(User $user)
    {
        return $user->can('delete_role');
    }
}
