<?php

namespace App\Http\Requests\Gallery;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class GalleryRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'images' => ['required', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'id_parent' => ['nullable', 'exists:products,id'],
            'status' => ['required', 'boolean'],
        ];
    }

    public function methodPut()
    {
        return [
            'image' => ['nullable', 'image', 'max:2048'],
            'id_parent' => ['nullable', 'exists:products,id', 'exists:gallery,id'],
            'status' => ['nullable', 'boolean'],
        ];
    }
}
