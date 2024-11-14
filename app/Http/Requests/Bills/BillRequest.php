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
            'note' => ['nullable', 'string', 'max:255'],
            'cart' => ['required', 'array'],
        ];
    }
}
