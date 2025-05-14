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
     * The name of the form request to be used for the controller.
     */
    protected ?string $request;

    /**
     * The name of the service to be used for the controller.
     */
    protected ?string $service;

    /**
     * Constructor to initialize properties.
     */
    public function __construct(
        ?string $request = null,
        ?string $service = null,
    ) {
        $this->request = $request;
        $this->service = $service;
    }
}