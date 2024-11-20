<?php

namespace App\Http\Requests\BillServiceRequest;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class BillServiceRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'customer_id' => ['required', 'exists:customers,uid'],
        ];
    }
}
