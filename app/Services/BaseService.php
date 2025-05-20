<?php

namespace App\Services;

abstract class BaseService
{
    /**
     * The name of the model to be used for the controller.
     */
    protected $instance;

    /**
     * The name of the repository to be used for the controller.
     */
    protected $repository;

    public function __construct($repository)
    {
        $this->repository = $repository;
    }
}
