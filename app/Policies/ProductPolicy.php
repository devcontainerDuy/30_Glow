<?php

namespace App\Policies;

use App\Models\User;

class ProductPolicy
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
        return $user->can('read_product');
    }

    public function show(User $user)
    {
        return $user->can('show_product');
    }

    public function create(User $user)
    {
        return $user->can('create_product');
    }

    public function update(User $user)
    {
        return $user->can('update_product');
    }

    public function delete(User $user)
    {
        return $user->can('delete_product');
    }
}
