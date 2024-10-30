<?php

namespace App\Http\Requests\Services;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class ServiceRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric'],
            'compare_price' => ['required', 'numeric'],
            'discount' => ['required', 'numeric'],
            'summary' => ['required', 'string'],
            'id_collection' => ['required', 'exists:services_collections,id'],
            'image' => ['required', 'image', 'max:2048'],
            'content' => ['required', 'string'],
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPut()
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'numeric'],
            'compare_price' => ['nullable', 'numeric'],
            'discount' => ['nullable', 'numeric'],
            'summary' => ['nullable', 'string'],
            'id_collection' => ['nullable', 'exists:services_collections,id'],
            'image' => ['nullable', 'image', 'max:2048'],
            'content' => ['nullable', 'string'],
            'status' => ['nullable', 'boolean'],
            'highlighted' => ['nullable', 'boolean'],
        ];
    }
}
