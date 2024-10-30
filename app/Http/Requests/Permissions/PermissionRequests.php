<?php

namespace App\Http\Requests\Permissions;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class PermissionRequests extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
            'guard_name' => ['required', 'string', 'max:255',],
        ];
    }

    public function methodPut()
    {
        return [
            'name' => ['nullable', 'string', 'max:255', 'unique:permissions,name'],
            'guard_name' => ['nullable', 'string', 'max:255',],
        ];
    }
}
