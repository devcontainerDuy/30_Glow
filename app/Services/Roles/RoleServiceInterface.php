<?php

namespace App\Services\Roles;

use Illuminate\Http\Request;

interface RoleServiceInterface
{
    public function read(): mixed;
    public function created(array $data): array|bool;
    public function updated(int $id, array $data): array|bool;
    public function deleted(int $id);
    public function givePermissionToRole(int $id, Request $request): array|bool;
}