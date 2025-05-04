<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;

class UserRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPost()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'roles' => ['nullable', 'exists:roles,name'],
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPut()
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255', 'unique:users'],
            'roles' => ['nullable', 'exists:roles,name'],
            'status' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodDelete()
    {
        return [
            'id' => ['required', 'exists:users,id'],
        ];
    }
}