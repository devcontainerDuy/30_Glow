<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class AuthenticateRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:customers,email', 'unique:customers,phone'],
            'phone' => ['required', 'numeric', 'unique:customers,phone'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            // 'password_confirmation' => ['required', 'string', 'min:8'],
            'social_id' => ['nullable', 'sometimes', 'string'],
            'social_type' => ['nullable', 'sometimes ', 'string'],
        ];
    }
}