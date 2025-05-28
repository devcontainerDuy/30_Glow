<?php

namespace App\Services\Permissions;

interface PermissionServiceInterface
{
    public function read(): mixed;
    public function created(array $data): bool;
    public function updated(int $id, array $data): bool;
    public function deleted(int $id): bool;
}