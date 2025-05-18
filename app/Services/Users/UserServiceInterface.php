<?php

namespace App\Services\Users;

interface UserServiceInterface
{
    public function read(): mixed;
    public function created(array $data): array;
    public function updated(int $id, array $data): array|bool;
    public function deleted(int $id): bool;
}