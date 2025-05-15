<?php

namespace App\Policies;

use App\Models\User;

class CustomerPolicy
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
        return $user->can('read_customer');
    }

    public function show(User $user)
    {
        return $user->can('show_customer');
    }

    public function create(User $user)
    {
        return $user->can('create_customer');
    }

    public function update(User $user)
    {
        return $user->can('update_customer');
    }

    public function delete(User $user)
    {
        return $user->can('delete_customer');
    }
}
