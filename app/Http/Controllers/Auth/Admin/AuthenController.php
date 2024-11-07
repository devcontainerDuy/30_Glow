<?php

namespace App\Http\Controllers\Auth\Admin;

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
        if (Auth::viaRemember() || Auth::check()) {
            return redirect()->route('admin.home');
        }
        return Inertia::render('Auth/Login');
    }

    public function handleLogin(AuthenRequest $request)
    {
        $this->data = $request->validated();
        if (Auth::attempt(['email' => $this->data['email'], 'password' => $this->data['password'], 'status' => 1], $this->data['remember_token'])) {
            Session::regenerateToken();
            return response()->json(['check' => true, 'message' => 'Đăng nhập thành công!'], 200);
        }
        return response()->json(['check' => false, 'message' => 'Đăng nhập thất bại!'], 400);
    }

    public function handleLogout()
    {
        Auth::logout();
        Session::invalidate();
        Session::regenerateToken();
        return response()->json(['check' => true, 'message' => 'Đăng xuất thành công!'], 200);
    }
    public function loginManager(AuthenRequest $request)
    {
        $this->data = $request->validated();

        if (Auth::guard('api')->attempt(['email' => $this->data['email'], 'password' => $this->data['password'], 'status' => 1], $this->data['remember_token'])) {
            $this->instance = Auth::guard('api')->user();

            if ($this->instance->id_role === 2 || $this->instance->id_role === 3) {
                $this->instance->tokens()->delete();

                $token = $this->instance->createToken($this->instance->name)->plainTextToken;

                return response()->json(['check' => true, 'role' => $this->instance->id_role === 2 ? 'manager' : 'staff', 'token' => $token], 200);
            } else {
                Auth::guard('api')->logout();
                return response()->json(['check' => false, 'message' => 'Bạn không có quyền truy cập!'], 403);
            }
        }
        return response()->json(['check' => false, 'message' => 'Đăng nhập thất bại!'], 400);
    }
}