<?php

namespace App\Services\Users;

use Illuminate\Database\Eloquent\Collection;

interface UserServiceInterface
{
    public function read(): Collection;
    public function created(array $data);
    public function updated(int $id, array $data);
    public function deleted(int $id);
}