<?php

namespace App\Services\Roles;

use App\Repository\Roles\RoleRepositoryInterface;
use App\Services\BaseService;
use Illuminate\Http\Request;

class RoleService extends BaseService implements RoleServiceInterface
{
    public function __construct(RoleRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function read(): mixed
    {
        return $this->repository->with('permissions')->getAll();
    }

    public function created(array $data): array|bool
    {
        return $this->repository->create($data);
    }

    public function updated(int $id, array $data): array|bool
    {
        if (isset($data['permissions'])) {
            $this->instance = $this->repository->find($id);
            $this->instance->syncPermissions($data['permissions']);
            unset($data['permissions']);
        }
        return $this->repository->update($id, $data);
    }

    public function deleted(int $id)
    {
        return $this->repository->delete($id);
    }

    public function givePermissionToRole(int $id, Request $request): array|bool
    {
        $instance = $this->repository->find($id);

        if (!$instance) {
            return false;
        }

        return $instance->syncPermissions($request->only('permissions')) ?: false;
    }
}