<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repository\Users\UserRepositoryInterface::class,
            \App\Repository\Users\UserRepository::class,
        );
        $this->app->bind(
            \App\Repository\Roles\RoleRepositoryInterface::class,
            \App\Repository\Roles\RoleRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
