<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string[]  ...$roles
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (Auth::guard('web')->check()) {
            $user = Auth::guard('web')->user();

            if ($user->hasAnyRole($roles)) {
                return $next($request);
            }

            Auth::guard('web')->logout();
            return redirect()->route('forbidden');
        }

        return redirect()->intended(route('auth.login'));
    }
}
