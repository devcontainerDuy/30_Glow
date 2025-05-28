<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ServicesProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Services\Users\UserServiceInterface::class,
            \App\Services\Users\UserService::class
        );

        $this->app->bind(
            \App\Services\Roles\RoleServiceInterface::class,
            \App\Services\Roles\RoleService::class
        );

        $this->app->bind(
            \App\Services\Permissions\PermissionServiceInterface::class,
            \App\Services\Permissions\PermissionService::class
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
