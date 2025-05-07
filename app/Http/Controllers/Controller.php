<?php

namespace App\Http\Controllers;

abstract class Controller
{
    /**
     * The name of the model to be used for the controller.
     * @var string
     */
    protected ?string $instance;

    /**
     * The name of the model to be used for the controller.
     */
    protected ?string $model;

    /**
     * The name of the form request to be used for the controller.
     */
    protected ?string $request;

    /**
     * The name of the service to be used for the controller.
     */
    protected ?string $service;

    /**
     * The name of the repository to be used for the controller.
     */
    protected ?string $repository;

    /**
     * Constructor to initialize properties.
     */
    public function __construct(
        ?string $instance = null,
        ?string $model = null,
        ?string $request = null,
        ?string $service = null,
        ?string $repository = null
    ) {
        $this->instance = $instance;
        $this->model = $model;
        $this->request = $request;
        $this->service = $service;
        $this->repository = $repository;
    }
}