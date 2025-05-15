<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'email' => 'required|email|exists:customers,email'
        ];
    }

    public function methodPut()
    {
        return [
            'password' => 'required|confirmed|min:8',
        ];
    }
}