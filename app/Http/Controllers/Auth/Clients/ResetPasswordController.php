<?php

namespace App\Http\Controllers\Auth\Clients;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Models\Customers;
use App\Models\PasswordResetTokens;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Notifications\ResetPasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ResetPasswordController extends Controller
{
    public function __construct()
    {
        $this->model = Customers::class;
    }

    /**
     * Create token password reset.
     *
     * @param  Request $request
     * @return JsonResponse
     */
    public function sendMail(ForgotPasswordRequest $request)
    {
        $this->instance = $this->model::where('email', $request->input('email'))->active()->first();

        if (!$this->instance) {
            return response()->json(['check' => false, 'message' => 'Email not found'], 404);
        }

        $passwordReset = PasswordResetTokens::updateOrCreate(
            ['email' => $this->instance->email],
            [
                'email' => $this->instance->email,
                'token' => Str::random(60), // bin2hex(random_bytes(32)) for Laravel 7
            ]
        );

        if ($passwordReset) {
            $this->instance->notify(new ResetPasswordRequest($passwordReset->token));
        }

        return response()->json(['check' => true, 'message' => 'We have e-mailed your password reset link!'], 200);
    }

    /**
     * Reset password.
     *
     * @param  Request $request
     * @return JsonResponse
     */
    public function reset(ForgotPasswordRequest $request, string $token)
    {
        $passwordReset = PasswordResetTokens::where('token', $token)->first();

        if (!$passwordReset) {
            return response()->json(['check' => false, 'message' => 'Mã thông báo đặt lại mật khẩu này không hợp lệ. Vui lòng thử lại.'], 404);
        }

        if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {
            $passwordReset->delete();
            return response()->json(['check' => false, 'message' => 'Hết thời gian xử lý!'], 422);
        }

        $this->instance = $this->model::where('email', $passwordReset->email)->first();

        if (!$this->instance) {
            return response()->json(['check' => false, 'message' => 'Chúng tôi không thể tìm thấy người dùng nào có địa chỉ email đó.'], 404);
        }

        $this->instance->update([
            'password' => Hash::make($request->input('password')),
        ]);

        $passwordReset->delete();
        return response()->json(['check' => true, 'message' => 'Mật khẩu của bạn đã được đặt lại thành công!'], 200);
    }
}