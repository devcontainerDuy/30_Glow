<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                if (Auth::guard($guard)->user()->id_role == 1 || Auth::guard($guard)->user()->id_role == 2) {
                    return $next($request);
                }
                Auth::guard($guard)->logout();
                return response()->json(['status' => false, 'message' => 'Bạn không có quyền truy cập.', 'url' => route('auth.login')], 403);
            }
        }

        return response()->json(['status' => false, 'message' => 'Vui lòng đăng nhâp.'], 403);
    }
}
