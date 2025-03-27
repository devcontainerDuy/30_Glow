<?php

namespace App\Http\Requests\Contacts;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class ContactsRequest extends BaseRequest
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
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'required|string',
            'note' => 'nullable|string|max:255',
        ];
        if ($this->routeIs('store')) {
            $return['id'] = 'required|string|max:255'; 
            $return['replyMessage'] = 'required|string';
        } else {
            $return['id'] = 'nullable|string|max:255'; 
            $return['replyMessage'] = 'nullable|string';
        }
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
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'nullable|string',
            'note' => 'nullable|string|max:255',
            'status' => 'nullable|integer|in:0,1',
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
