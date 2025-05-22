<?php

namespace App\Repository;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface EloquentRepositoryInterface
{
    /**
     * Get all records from the repository.
     *
     * @return Collection
     */
    public function getAll() : Collection;

    /**
     * Find a record by its ID.
     *
     * @param int $id
     * @return Model|null
     */
    public function find(int $id): ?Model;

    /**
     * Create a new record in the repository.
     *
     * @param array $data
     * @return array
     */
    public function create(array $data): array|bool;

    /**
     * Update an existing record in the repository.
     *
     * @param int $id
     * @param array $data
     * @return array
     */
    public function update(int $id, array $data): array|bool;

    /**
     * Delete a record from the repository.
     *
     * @param int $id
     * @return array
     */
    public function delete(int $id): bool;

    /**
     * Get a paginated list of records from the repository.
     *
     * @param int $perPage
     * @param array $columns
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): \Illuminate\Pagination\LengthAwarePaginator;

    /**
     * Paginate using cursor
     * 
     * @param int $perPage
     * @param array $columns
     * @param string $cursorName
     * @param string|null $cursor
     * @return \Illuminate\Contracts\Pagination\CursorPaginator
     */
    public function cursorPaginate(
        int $perPage = 15,
        array $columns = ['*'],
        string $cursorName = 'cursor',
        ?string $cursor = null
    );

    /**
     * Find records by their conditions.
     *
     * @param array $conditions
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findBy(array $conditions): \Illuminate\Database\Eloquent\Collection;

    /**
     * Find the first record by its conditions.
     *
     * @param array $conditions
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function firstBy(array $conditions): ?\Illuminate\Database\Eloquent\Model;
    /**
     * Load relationships for the model.
     *
     * @param array|string $relations
     * @return $this
     */
    public function with($relations): self;

    /**
     * Set the columns to be selected.
     *
     * @param array $columns
     * @return $this
     */
    public function select(array $columns): self;

    /**
     * Order the records by a specific column.
     *
     * @param string $column
     * @param string $direction
     * @return $this
     */
    public function orderBy(string $column, string $direction = 'asc'): self;

    /**
     * Update multiple records in the repository.
     *
     * @param array $conditions
     * @param array $data
     * @return int
     */
    public function bulkUpdate(array $conditions, array $data): int;

    /**
     * Delete multiple records from the repository.
     *
     * @param array $conditions
     * @return int
     */
    public function bulkDelete(array $conditions): int;
    /**
     * Count the number of records in the repository.
     *
     * @param array $conditions
     * @return int
     */
    public function count(array $conditions = []): int;

    /**
     * Check if a record exists in the repository.
     *
     * @param array $conditions
     * @return bool
     */
    public function exists(array $conditions): bool;
}
