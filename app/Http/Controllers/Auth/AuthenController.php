<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AuthenRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class AuthenController extends Controller
{
    public function __construct()
    {
        $this->model = User::class;
    }
    public function login()
    {
        if (Session::has('user_session')) {
            return redirect()->route('admin.home');
        }
        return Inertia::render('Auth/Login');
    }

    public function handleLogin(AuthenRequest $request)
    {
        $this->data = $request->validated();
        if (Auth::attempt(['email' => $this->data['email'], 'password' => $this->data['password'], 'status' => 1], isset($this->data['remember_token']) ? true : false)) {
            Session::regenerateToken();
            $this->data = Auth::user();
            Session::put('user_session', $this->data);
            return response()->json(['check' => true, 'msg' => 'Đăng nhập thành công!'], 200);
        }
        return response()->json(['check' => false, 'msg' => 'Đăng nhập thất bại!'], 400);
    }

    public function handleLogout()
    {
        Auth::logout();
        Session::invalidate();
        Session::regenerateToken();
        return response()->json(['check' => true, 'msg' => 'Đăng xuất thành công!'], 200);
    }
}
