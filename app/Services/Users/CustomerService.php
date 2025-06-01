<?php

namespace App\Services\Users;

use App\Repository\Users\CustomerRepositoryInterface;
use App\Services\BaseService;



class CustomerService extends BaseService implements CustomerServiceInterface
{
    public function __construct(CustomerRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}