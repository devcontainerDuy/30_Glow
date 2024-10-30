<?php

namespace App\Http\Requests\Sitemap;

use Illuminate\Foundation\Http\FormRequest;

class SitemapRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPost()
    {
        return [
            'page' => 'required|string|max:255',
            'content' => 'required|string',
            'url' => 'required|url|max:255',
            'static_page' => 'required|integer'
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPut()
    {
        return [
            'page' => 'required|string|max:255',
            'content' => 'required|string',
            'url' => 'required|max:255',
            'static_page' => 'required|integer'
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
