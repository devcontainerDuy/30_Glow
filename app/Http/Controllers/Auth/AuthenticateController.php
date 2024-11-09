<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AuthenticateRequest;
use Illuminate\Http\Request;
use App\Mail\createUser;
use App\Models\Customers;
use App\Traits\GeneratesUniqueId;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthenticateController extends Controller
{
    use GeneratesUniqueId;
    public function __construct()
    {
        $this->model = Customers::class;
    }

    public function register(AuthenticateRequest $request)
    {
        $this->data = $request->validated();

        $this->data['uid'] = $this->createCodeCustomer();
        $this->data['password'] = Hash::make($request->input('password'));

        $this->instance = $this->model::create($this->data);
        $this->instance->createToken($this->instance->name);
        if ($this->instance) {
            $dataMail = [
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => $request->input('password'),
            ];
            $this->data = $this->model::all();
            Mail::to($request->input('email'))->send(new createUser($dataMail));
            return response()->json(['check' => true, 'message' => 'Tạo tài khoản thành công!'], 201);
        }
        return response()->json(['check' => false, 'message' => 'Tạo tài khoản thất bại!'], status: 400);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email', 'exists:customers,email'],
            'password' => ['required', 'string', 'min:8'],
            'remember_token' => ['nullable', 'boolean']
        ]);

        if ($validator->fails()) {
            return response()->json(['check' => false, 'message' => $validator->errors()->first()]);
        }

        if (Auth::guard('customer')->attempt(['email' => $request->email, 'password' => $request->password, 'status' => 1], $request->remember_token)) {
            $this->instance = Auth::guard('customer')->user();
            $this->instance->tokens()->delete();
            $expiry = $request->remember_token ? now()->addDays(2) : now()->addHours(6);
            $token = $this->instance->createToken($this->instance->uid);
            $token->accessToken->expires_at = $expiry;
            return response()->json(['check' => true, 'token' => $token->plainTextToken, 'expiry' => $expiry->timestamp], 200);
        } else {
            return response()->json(['check' => false, 'message' => 'Sai email hoặc mật khẩu'], 401);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['check' => true, 'message' => 'Đăng xuất thành công!'], 200);
    }
}
