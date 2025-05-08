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
        ];
    }
}
