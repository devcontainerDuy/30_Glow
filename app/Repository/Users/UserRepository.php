<?php

namespace App\Repository\Users;

use App\Repository\EloquentRepository;
use Illuminate\Pagination\CursorPaginator;

class UserRepository extends EloquentRepository implements UserRepositoryInterface
{
    /**
     * UserRepository constructor.
     */
    public function getModel(): string
    {
        return \App\Models\User::class;
    }

    public function getAllUsers(): CursorPaginator
    {
        return $this->model->with('roles')->cursorPaginate(20);
    }
}
