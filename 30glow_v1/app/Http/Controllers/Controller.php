<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    protected $model; // là model mà mình sử dụng 
    protected $data; // là dữ liệu gửi lên hoặc trả về
    protected $instance; // đặt tên cho biến
    protected $crumbs; // đặt tên cho bộ breadcrumb
}
