<?php

namespace App\Policies;

use App\Models\User;

class BrandPolicy
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
        return $user->can('read_brand');
    }

    public function show(User $user)
    {
        return $user->can('show_brand');
    }

    public function create(User $user)
    {
        return $user->can('create_brand');
    }

    public function update(User $user)
    {
        return $user->can('update_brand');
    }

    public function delete(User $user)
    {
        return $user->can('delete_brand');
    }
}
