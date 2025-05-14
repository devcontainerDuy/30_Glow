<?php

namespace App\Services\Users;

use App\Repository\Users\UserRepositoryInterface;

class UserService implements UserServiceInterface
{
    protected UserRepositoryInterface $repository;

    public function __construct(UserRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function read(): array
    {
        return $this->repository->getAllUsers();
    }

    public function created(array $data): array
    {
        return $this->repository->create($data);
    }

    public function updated(int $id, array $data): array|bool
    {
        return $this->repository->update($id, $data);
    }

    public function deleted(int $id): bool
    {
        return $this->repository->delete($id) ? true : false;
    }

}