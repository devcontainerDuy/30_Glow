<?php

namespace App\Services\Users;

use App\Repository\Users\UserRepositoryInterface;
use App\Services\BaseService;

class UserService extends BaseService implements UserServiceInterface
{
    public function __construct(UserRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function read(): array
    {
        return $this->repository->getAll();
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
        return $this->repository->delete($id);
    }

}