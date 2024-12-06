<?php

namespace App\Http\Requests\Comments;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class CommentsRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPost()
    {
        return [
            'id_product'   => 'nullable|exists:products,id',
            'id_customer'  => 'nullable|exists:customers,id',
            'id_user'      => 'nullable|exists:users,id',
            'id_service'   => 'nullable|exists:services,id',
            'comment'      => 'required|string',
            'status'       => 'nullable|in:0,1',
            'id_parent'    => 'nullable|exists:comment,id',
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
