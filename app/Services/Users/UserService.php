<?php

namespace App\Services\Users;

use App\Repository\Roles\RoleRepositoryInterface;
use App\Repository\Users\UserRepositoryInterface;
use App\Traits\GeneratesUniqueId;
use Illuminate\Pagination\CursorPaginator;

class UserService implements UserServiceInterface
{
    use GeneratesUniqueId;
    protected UserRepositoryInterface $repository;
    protected RoleRepositoryInterface $roleRepository;

    public function __construct(UserRepositoryInterface $repository, RoleRepositoryInterface $roleRepository)
    {
        $this->repository = $repository;
        $this->roleRepository = $roleRepository;
    }

    public function read(): mixed
    {
        return $this->repository->getAllUsers();
    }

    public function created(array $data): array
    {
        $data['uid'] = $this->generateUUIDv4(false);
        return $this->repository->create($data);
    }

    public function updated(int $id, array $data): array|bool
    {
        return $this->repository->update($id, $data);
    }

    public function deleted(int $id)
    {
        return $this->repository->delete($id);
    }

}