<?php

namespace App\Http\Requests\Roles;

use App\Http\Requests\BaseRequest;

class RoleRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function methodPost()
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
        ];
    }

    public function methodPut()
    {
        return [
            'name' => ['nullable', 'string', 'max:255', 'unique:roles,name'],
            'guard_name' => ['nullable', 'string', 'max:255',],
        ];
    }
}
