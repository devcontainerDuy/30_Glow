<?php

namespace App\Policies;

use App\Models\User;

class PostPolicy
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
        return $user->can('read_post');
    }

    public function show(User $user)
    {
        return $user->can('show_post');
    }

    public function create(User $user)
    {
        return $user->can('create_post');
    }

    public function update(User $user)
    {
        return $user->can('update_post');
    }

    public function delete(User $user)
    {
        return $user->can('delete_post');
    }
}
