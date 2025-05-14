<?php

namespace App\Repository\Users;

use App\Repository\EloquentRepository;

class UserRepository extends EloquentRepository implements UserRepositoryInterface
{
    /**
     * UserRepository constructor.
     */
    public function getModel(): string
    {
        return \App\Models\User::class;
    }
}
