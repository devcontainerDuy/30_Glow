<?php

namespace App\Http\Requests\Categories;

use App\Http\Requests\BaseRequest;

class CategoriesRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPost()
    {
        return [
            'name' => 'required|string|max:255',
            'id_parent' => 'nullable|exists:categories,id',
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPut()
    {
        return [
            'name' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodDelete()
    {
        return [];
    }
}
