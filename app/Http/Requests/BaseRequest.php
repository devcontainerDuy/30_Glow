<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class BaseRequest extends FormRequest
{
    protected $validate = [];
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->isMethod('GET')) {
            $this->validate = $this->methodGet();
        } elseif ($this->isMethod('POST')) {
            $this->validate = $this->methodPost();
        } elseif ($this->isMethod('PUT')) {
            $this->validate = $this->methodPut();
        } elseif ($this->isMethod('PATCH')) {
            $this->validate = $this->methodPatch();
        } elseif ($this->isMethod('DELETE')) {
            $this->validate = $this->methodDelete();
        } elseif ($this->isMethod('OPTIONS')) {
            $this->validate = $this->methodOptions();
        }
        return $this->validate;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodGet()
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPost()
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPut()
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPatch()
    {
        return [];
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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodOptions()
    {
        return [];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'check' => false,
            'message'  => $validator->errors()->first(),
        ], 200));
    }
}
