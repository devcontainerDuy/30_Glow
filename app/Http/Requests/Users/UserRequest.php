<?php

namespace App\Http\Requests\Users;

use App\Http\Requests\BaseRequest;

class UserRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function methodPost(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone'=> 'nullable|string|min:10|max:11',
            'address' => 'nullable|string|max:255',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|same:password',
        ];
    }

    public function methodPut(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $this->route('id'),
            'phone'=> 'nullable|string|min:10|max:11',
            'address' => 'nullable|string|max:255',
            'password_attributes' => 'nullable|string|min:8',
            'password' => 'nullable|string|min:8|confirmed',
            'password_confirmation' => 'nullable|string|same:password',
            'roles' => 'nullable|array|exists:roles,name',
            'roles.*'=> 'string|sometimes',
        ];
    }
}
