<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
    /**
     * The name of the model to be used for the controller.
     * @var string
     */
    protected $instance;

    /**
     * The name of the service to be used for the controller.
     */
    protected $service;

    /**
     * The name of the repository to be used for the controller.
     */
    protected $repository;
}