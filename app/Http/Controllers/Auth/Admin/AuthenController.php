<?php

namespace App\Http\Controllers\Auth\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AuthenRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

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
        try {
            $this->data = $request->validated();
            if (Auth::attempt([
                'email' => $this->data['email'],
                'password' => $this->data['password'],
                'status' => 1
            ], $this->data['remember_token'])) {
                Session::regenerateToken();
                $user = Auth::user();
                if ($user && $user->can('isActiveRoles')) {
                    return response()->json(['check' => true, 'message' => 'Đăng nhập thành công!'], 200);
                } else {
                    Auth::logout();
                    return response()->json(['check' => false, 'message' => 'Tài khoản không có quyền truy cập!'], 403);
                }
            }
            return response()->json(['check' => false, 'message' => 'Đăng nhập thất bại!'], 400);
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json(['check' => false, 'message' => 'Có lỗi xảy ra, vui lòng thử lại!'], 500);
        }
    }

    public function handleLogout()
    {
        Auth::logout();
        Session::invalidate();
        Session::regenerateToken();
        return response()->json(['check' => true, 'message' => 'Đăng xuất thành công!'], 200);
    }
    public function loginManager(AuthenRequest $request)
    {
        $this->data = $request->validated();

        if (Auth::guard('api')->attempt(['email' => $this->data['email'], 'password' => $this->data['password'], 'status' => 1], $this->data['remember_token'])) {
            $this->instance = Auth::guard('api')->user()->load('roles');

            if ($this->instance->roles->pluck('id')[0] === 2 || $this->instance->roles->pluck('id')[0] === 3) {
                $this->instance->tokens()->delete();

                $expiry = $this->data['remember_token'] ? now()->addDays(2) : now()->addHours(6);
                $token = $this->instance->createToken($this->instance->uid);
                $token->expires_at = $expiry;

                return response()->json(['check' => true, 'role' => $this->instance->roles->pluck('id')[0] === 2 ? 'manager' : 'staff', 'uid' => $this->instance->uid, 'token' => $token->plainTextToken, 'expiry' => $expiry->timestamp], 200);
            } else {
                Auth::guard('api')->logout();
                return response()->json(['check' => false, 'message' => 'Bạn không có quyền truy cập!'], 403);
            }
        }
        return response()->json(['check' => false, 'message' => 'Đăng nhập thất bại!'], 401);
    }

    public function handleLogoutManager()
    {
        try {
            $this->instance = Auth::user()->load('roles');
            if ($this->instance) {
                $this->instance->tokens()->delete();
                Auth::guard('api')->logout();
                return response()->json(['check' => true, 'message' => 'Đăng xuất thành công!'], 200);
            } else {
                return response()->json(['check' => false, 'message' => 'Người dùng không tồn tại hoặc không được xác thực!'], 400);
            }
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['check' => false, 'message' => 'Đăng xuất thất bại!'], 400);
        }
    }
}
