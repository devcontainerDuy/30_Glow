<?php

namespace App\Http\Requests\Products;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount' => ['required', 'numeric', 'min:0', 'max:100'],
            'image' => ['required', 'array', 'max:2048'],
            'content' => 'nullable|string',
            'id_category' => ['required', 'exists:categories,id'],
            'id_brand' => ['required', 'exists:brands,id'],
            'in_stock' => ['required', 'integer', 'min:0'],
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
            'discount' => ['nullable', 'numeric'],
            'image' => ['nullable', 'image', 'max:2048'],
            'status' => ['nullable', 'boolean'],
            'highlighted' => ['nullable', 'boolean'],
            'content' => ['nullable', 'string'],
            'id_category' => ['nullable', 'exists:categories,id',],
            'id_brand' => ['nullable', 'exists:brands,id'],
            'in_stock' => ['nullable', 'integer', 'min:0'],
        ];
    }
    public function messages()
    {
        return [
            '*.min' => 'Trường :attribute không được mang giá trị âm',
        ];
    }
}
