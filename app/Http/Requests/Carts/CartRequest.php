<?php

namespace App\Http\Requests\Carts;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class CartRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'id_customer' => ['required', 'string', 'exists:customers,uid'],
            'id_product' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    public function methodPut()
    {
        return [
            'id_customer' => ['sometimes', 'string', 'exists:customers,uid'],
            'id_product' => ['sometimes', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}