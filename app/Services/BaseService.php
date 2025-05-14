<?php

namespace App\Services;

abstract class BaseService
{
    /**
     * The name of the model to be used for the controller.
     * @var string
     */
    protected ?string $instance;

    /**
     * The name of the repository to be used for the controller.
     */
    protected mixed $repository = null;

    public function __construct(mixed $repository)
    {
        $this->repository = $repository;
    }
}
