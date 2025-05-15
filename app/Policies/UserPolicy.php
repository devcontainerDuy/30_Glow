<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
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
        return $user->can('read_user');
    }

    public function show(User $user)
    {
        return $user->can('show_user');
    }

    public function create(User $user)
    {
        return $user->can('create_user');
    }

    public function update(User $user)
    {
        return $user->can('update_user');
    }

    public function delete(User $user)
    {
        return $user->can('delete_user');
    }
}
