<?php

namespace App\Repository\Users;

use App\Repository\EloquentRepositoryInterface;

interface UserRepositoryInterface extends EloquentRepositoryInterface
{
    public function getAllUsers();
}
