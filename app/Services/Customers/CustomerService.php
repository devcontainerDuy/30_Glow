<?php

namespace App\Services\Customers;

use App\Repository\Customers\CustomerRepositoryInterface;
use App\Services\BaseService;
use App\Traits\GeneratesUniqueId;
use Illuminate\Database\Eloquent\Collection;

class CustomerService extends BaseService implements CustomerServiceInterface
{
    use GeneratesUniqueId;

    public function __construct(CustomerRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function read(): Collection
    {
        return $this->repository->getAll();
    }

    public function created(array $data): array|bool
    {
        $data['uid'] = $this->generateUUIDv4(false);
        return $this->repository->create($data);
    }

    public function updated(int $id, array $data): array|bool
    {
        return $this->repository->update($id, $data);
    }

    public function deleted(int $id): array|bool
    {
        return $this->repository->delete($id);
    }
}