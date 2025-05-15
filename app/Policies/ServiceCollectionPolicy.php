<?php

namespace App\Policies;

use App\Models\User;

class ServiceCollectionPolicy
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
        return $user->can('read_service_collection');
    }

    public function show(User $user)
    {
        return $user->can('show_service_collection');
    }

    public function create(User $user)
    {
        return $user->can('create_service_collection');
    }

    public function update(User $user)
    {
        return $user->can('update_service_collection');
    }

    public function delete(User $user)
    {
        return $user->can('delete_service_collection');
    }
}
