<?php

namespace App\Services\Users;

use App\Repository\Roles\RoleRepositoryInterface;
use App\Repository\Users\UserRepositoryInterface;
use App\Services\BaseService;
use App\Traits\GeneratesUniqueId;
use Illuminate\Database\Eloquent\Collection;

class UserService extends BaseService implements UserServiceInterface
{
    use GeneratesUniqueId;
    // protected UserRepositoryInterface $repository;
    protected RoleRepositoryInterface $roleRepository;

    public function __construct(UserRepositoryInterface $repository, RoleRepositoryInterface $roleRepository)
    {
        $this->repository = $repository;
        $this->roleRepository = $roleRepository;
    }

    public function read(): Collection
    {
        return $this->repository->with('roles')->getAll();
    }

    public function created(array $data)
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