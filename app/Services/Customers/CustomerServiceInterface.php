<?php

namespace App\Services\Customers;

use Illuminate\Database\Eloquent\Collection;

interface CustomerServiceInterface
{
    public function read(): Collection;

    /**
     * @param array $data
     * @return array|bool
     */
    public function created(array $data): array|bool;

    /**
     * @param int $id
     * @param array $data
     * @return array|bool
     */
    public function updated(int $id, array $data): array|bool;

    /**
     * @param int $id
     * @return array|bool
     */
    public function deleted(int $id): array|bool;
}