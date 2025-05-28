<?php

namespace App\Services\Permissions;

use App\Repository\Permissions\PermissionRepositoryInterface;
use App\Services\BaseService;

class PermissionService extends BaseService implements PermissionServiceInterface
{
public function __construct(PermissionRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function read(): mixed
    {
        return $this->repository->getAll();
    }

    public function created(array $data): bool
    {
        return $this->repository->create($data);
    }

    public function updated(int $id, array $data): bool
    {
        return $this->repository->update($id, $data);
    }    

    public function deleted(int $id): bool
    {
        return $this->repository->delete($id);
    }
}