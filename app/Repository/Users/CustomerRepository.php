<?php

namespace App\Repository\Users;

use App\Repository\EloquentRepository;



class CustomerRepository extends EloquentRepository implements CustomerRepositoryInterface 
{
    public function getModel(): string
    {
        return \App\Models\Customer::class;
    }
}