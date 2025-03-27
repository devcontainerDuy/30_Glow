<?php

namespace App\Http\Requests\Cumtomers;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class CustomerRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    // public function methodGet()
    // {
    //     return [
    //         'uid' => ['required', 'exists:customers,uid'],
    //     ];
    // }

    public function methodPost()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:customers,email'],
        ];
    }

    public function methodPut()
    {

        return [
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255', 'unique:customers,email'],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'numeric'],
            'status' => ['nullable', 'boolean'],
        ];
    }
}