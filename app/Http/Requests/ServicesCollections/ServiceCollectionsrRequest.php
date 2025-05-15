<?php

namespace App\Http\Requests\ServicesCollections;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class ServiceCollectionsrRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPut()
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'boolean'],
            'highlighted' => ['nullable', 'boolean'],
        ];
    }
}
