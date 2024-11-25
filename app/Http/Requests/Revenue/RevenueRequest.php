<?php

namespace App\Http\Requests\Revenue;

use App\Http\Requests\BaseRequest;

class RevenueRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function methodPost()
    {
        return [
            'startDate' => 'nullable|date',
            'endDate' => 'nullable|date|after_or_equal:startDate',
        ];
    }

    public function methodPut()
    {
        return [
        ];
    }
}
