<?php

namespace App\Http\Requests\Bills;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class BillRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'numeric'],
            'address' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'sometimes', 'string', 'max:255'],
            'name_order' => ['nullable', 'sometimes', 'string', 'max:255'],
            'email_order' => ['nullable', 'sometimes', 'string', 'email', 'max:255'],
            'phone_order' => ['nullable', 'sometimes', 'numeric'],
            'address_order' => ['nullable', 'sometimes', 'string', 'max:255'],
            'note_order' => ['nullable', 'sometimes', 'string', 'max:255'],
            'payment_method' => ['required', 'numeric', 'in:1,2,3'],
            'transaction_id' => ['nullable', 'sometimes', 'string', 'max:255'],
            'total' => ['required', 'numeric'],
            'cart' => ['sometimes', 'array'],
            'cart.*.product_id' => ['required_with:cart', 'integer'],
            'cart.*.quantity' => ['required_with:cart', 'integer', 'min:1'],
            'cart.*.unit_price' => ['required_with:cart', 'numeric', 'min:0'],
        ];
    }
}
