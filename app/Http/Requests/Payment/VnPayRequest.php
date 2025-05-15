<?php

namespace App\Http\Requests\Payment;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class VnPayRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'uid' => 'required|exists:bills,uid',
            'total' => 'required|numeric',
        ];
    }
}
