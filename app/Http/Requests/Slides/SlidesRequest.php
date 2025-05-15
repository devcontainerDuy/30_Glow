<?php

namespace App\Http\Requests\Slides;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class SlidesRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'name' => 'required|string|max:255',
            'status' => 'required|integer|in:0,1',
            'desktop' => 'nullable|array',
            'desktop.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPut()
    {
        return [
            'name' => 'nullable|string|max:255', // Nếu bạn muốn cho phép trường này không cần thiết
            'status' => 'nullable|integer|in:0,1', // Tương tự như trên
            'desktop' => 'nullable|array',
            'desktop.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
