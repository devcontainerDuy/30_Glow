<?php

namespace App\Repository;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class EloquentRepository implements EloquentRepositoryInterface
{
    /**
     * @var \Illuminate\Database\Eloquent\Model
     */
    protected Builder $model;

    /**
     * @var array $select
     */
    protected array $select = [];

    /**
     * Current Object instance
     *
     * @var object
     */
    protected ?object $instance = null;

    /**
     * get model
     * @return string
     */
    abstract public function getModel(): string;

    /**
     * EloquentRepository constructor.
     */
    public function __construct()
    {
        $this->setModel();
    }

    /**
     * EloquentRepository destructor.
     */
    public function __destruct()
    {
        $this->setModel();
    }

    /**
     * Set model
     */
    public function setModel(): void
    {
        //other -> new Model
        $model = app()->make($this->getModel());
        $this->model = $model->newQuery();
    }

    /**
     * Get all records from the repository.
     *
     * @return array|Collection
     * @throws \Exception
     */
    public function getAll(): Collection
    {
        if (!empty($this->select)) {
            $this->model->select($this->select);
        }

        return $this->model->get();
    }

    /**
     * Find a record by its ID.
     *
     * @param int $id
     * @return array
     * @throws \Exception
     */
    public function find(int $id): ?Model
    {
        return $this->model->find($id) ?: null;
    }

    /**
     * Create a new record in the repository.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data): array|bool
    {
        $this->instance = $this->model->create($data);
        return $this->instance ? true : false;
    }

    /**
     * Update an existing record in the repository.
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function update(int $id, array $data): bool
    {
        $this->instance = $this->model->find($id);
        return $this->instance ? $this->instance->update($data) : false;
    }

    /**
     * Delete a record from the repository.
     *
     * @param int $id
     * @return array
     */
    public function delete(int $id): bool
    {
        $this->instance = $this->model->find($id);
        return $this->instance ? $this->instance->delete() : false;
    }

    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->model->paginate($perPage, $columns);
    }

    public function cursorPaginate(
        int $perPage = 15,
        array $columns = ['*'],
        string $cursorName = 'cursor',
        ?string $cursor = null
    ) {
        return $this->model->cursorPaginate($perPage, $columns, $cursorName, $cursor);
    }

    public function findBy(array $conditions): Collection
    {
        return $this->model->where($conditions)->get();
    }

    public function firstBy(array $conditions): ?Model
    {
        return $this->model->where($conditions)->first();
    }

    public function with($relations): self
    {
        $this->model = $this->model->with($relations);
        return $this;
    }

    public function select(array $columns): self
    {
        $this->select = $columns;
        return $this;
    }

    public function orderBy(string $column, string $direction = 'asc'): self
    {
        $this->model = $this->model->orderBy($column, $direction);
        return $this;
    }

    public function bulkUpdate(array $conditions, array $data): int
    {
        return $this->model->where($conditions)->update($data);
    }

    public function bulkDelete(array $conditions): int
    {
        return $this->model->where($conditions)->delete();
    }

    public function count(array $conditions = []): int
    {
        return $conditions
            ? $this->model->where($conditions)->count()
            : $this->model->count();
    }

    public function exists(array $conditions): bool
    {
        return $this->model->where($conditions)->exists();
    }
}
