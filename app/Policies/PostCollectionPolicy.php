<?php

namespace App\Policies;

use App\Models\User;

class PostCollectionPolicy
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
        return $user->can('read_post_collection');
    }

    public function show(User $user)
    {
        return $user->can('show_post_collection');
    }

    public function create(User $user)
    {
        return $user->can('create_post_collection');
    }

    public function update(User $user)
    {
        return $user->can('update_post_collection');
    }

    public function delete(User $user)
    {
        return $user->can('delete_post_collection');
    }
}
