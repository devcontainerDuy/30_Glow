<?php

namespace App\Providers;

// use App\Services\Auth\JwtGuard;
use Illuminate\Contracts\Foundation\Application;
// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
        \App\Models\Products::class => \App\Policies\ProductPolicy::class,
        \App\Models\Categories::class => \App\Policies\CategoryPolicy::class,
        \App\Models\Brands::class => \App\Policies\BrandPolicy::class,
        \App\Models\Services::class => \App\Policies\ServicePolicy::class,
        \App\Models\ServicesCollections::class => \App\Policies\ServiceCollectionPolicy::class,
        \App\Models\Bookings::class => \App\Policies\BookingPolicy::class,
        \App\Models\Posts::class => \App\Policies\PostPolicy::class,
        \App\Models\PostCollections::class => \App\Policies\PostCollectionPolicy::class,
        \App\Models\User::class => \App\Policies\UserPolicy::class,
        \Spatie\Permission\Models\Role::class => \App\Policies\RolePolicy::class,
        \Spatie\Permission\Models\Permission::class => \App\Policies\PermissionPolicy::class,
        \App\Models\Customers::class => \App\Policies\CustomerPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Auth::extend('jwt', function (Application $app, string $name, array $config) {
        //     // Return an instance of Illuminate\Contracts\Auth\Guard...

        //     return new JwtGuard(Auth::createUserProvider($config['provider']));
        // });
    }
}