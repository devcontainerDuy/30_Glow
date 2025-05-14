<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repository\Users\UserRepositoryInterface::class,
            \App\Repository\Users\UserRepository::class
        );
        $this->app->bind(
            \App\Services\Users\UserServiceInterface::class,
            \App\Services\Users\UserService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // \Illuminate\Support\Facades\DB::listen(function ($query) {
        //     info($query->sql, $query->bindings, $query->time);
        // });
    }
}
