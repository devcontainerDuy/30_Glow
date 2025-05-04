<?php

namespace App\Http\Requests\Posts;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class PostRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string'],
            'image' => ['required', 'image', 'max:2048'],
            'id_collection' => ['required', 'exists:post_collections,id'],
            'content' => ['required', 'string'],
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPut()
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'id_collection' => ['nullable', 'exists:post_collections,id'],
            'content' => ['nullable', 'string'],
            'status' => ['nullable', 'boolean'],
            'highlighted' => ['nullable', 'boolean'],
        ];
    }
}
