<?php

namespace App\Policies;

use App\Models\User;

class CategoryPolicy
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
        return $user->can('read_category');
    }

    public function show(User $user)
    {
        return $user->can('show_category');
    }

    public function create(User $user)
    {
        return $user->can('create_category');
    }

    public function update(User $user)
    {
        return $user->can('update_category');
    }

    public function delete(User $user)
    {
        return $user->can('delete_category');
    }
}
