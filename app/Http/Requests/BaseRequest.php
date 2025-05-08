<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

abstract class BaseRequest extends FormRequest
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
        $methodMap = [
            'GET' => 'methodGet',
            'POST' => 'methodPost',
            'PUT' => 'methodPut',
            'PATCH' => 'methodPatch',
            'DELETE' => 'methodDelete',
            'OPTIONS' => 'methodOptions',
        ];

        $isMethod = $this->method();

        array_key_exists($isMethod, $methodMap) ?
            $this->validate = $this->$methodMap[$isMethod]() :
            $this->validate = $this->methodGet();

        return $this->validate;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodGet(): array
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPost(): array
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPut(): array
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPatch(): array
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodDelete(): array
    {
        return [];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodOptions(): array
    {
        return [];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'check' => false,
            'message' => $validator->errors()->first(),
        ], 200));
    }
}
