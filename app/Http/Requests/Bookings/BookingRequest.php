<?php

namespace App\Http\Requests\Bookings;

use App\Http\Requests\BaseRequest;
use Faker\Provider\Base;
use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function methodPost()
    {
        return [
            'id_user' => ['nullable', 'exists:users,uid'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'numeric'],
            'time' => ['required', 'date_format:Y-m-d H:i:s'],
            'service' => ['required', 'exists:services,id', 'array'],
            'service.*' => ['required', 'exists:services,id'],
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function methodPut()
    {
        return [
            'id_user' => ['nullable', 'exists:users,uid'],
            'status' => ['nullable', 'in:0,1,2,3,4,5'],
            'note' => ['nullable', 'string'],
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function methodDelete()
    {
        return [
            'note' => ['required', 'string'],
        ];
    }
}