<?php

namespace App\Repository\Roles;

use App\Repository\EloquentRepositoryInterface;

interface RoleRepositoryInterface extends EloquentRepositoryInterface
{
    public function pluck(string $column): array;
}