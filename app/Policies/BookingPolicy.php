<?php

namespace App\Policies;

use App\Models\User;

class BookingPolicy
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
        return $user->can('read_booking');
    }

    public function show(User $user)
    {
        return $user->can('show_booking');
    }

    // public function create(User $user)
    // {
    //     return $user->can('create_booking');
    // }

    // public function update(User $user)
    // {
    //     return $user->can('update_booking');
    // }

    // public function delete(User $user)
    // {
    //     return $user->can('delete_booking');
    // }
}
