<?php

namespace App\Repository\Users;

use App\Repository\EloquentRepositoryInterface;
use Illuminate\Pagination\CursorPaginator;

interface UserRepositoryInterface extends EloquentRepositoryInterface
{
    public function getAllUsers(): CursorPaginator;
}
