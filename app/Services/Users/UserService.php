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
    
    protected RoleRepositoryInterface $roleRepository;

    public function __construct(UserRepositoryInterface $repository, RoleRepositoryInterface $roleRepository)
    {
        parent::__construct($repository);
        $this->roleRepository = $roleRepository;
    }

    public function read(): Collection
    {
        return $this->repository->with('roles')->getAll();
    }

    public function created(array $data): array|bool
    {
        $data['uid'] = $this->generateUUIDv4(false);
        return $this->repository->create($data);
    }

    public function updated(int $id, array $data): array|bool
    {
        if (isset($data['roles'])) {
            $this->instance = $this->repository->find($id);
            $this->instance->syncRoles($data['roles']);
            unset($data['roles']);
        }
        return $this->repository->update($id, $data);
    }

    public function deleted(int $id): array|bool
    {
        return $this->repository->delete($id);
    }

}