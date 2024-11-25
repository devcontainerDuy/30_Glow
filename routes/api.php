<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum', 'web'])->get('/user', function (Request $request) {
    return Auth::user()->status === 1 ? $request->user() : redirect('auth/login');
});

Route::middleware('api')->group(function () {
    Route::controller(App\Http\Controllers\Auth\AuthenticateController::class)->group(function () {
        Route::post('register', 'register');
        Route::post('login', 'login');
        Route::post('logout', 'logout')->middleware('auth:sanctum');
    });

    Route::controller(App\Http\Controllers\Auth\Admin\AuthenController::class)->group(function () {
        Route::post('login-manager', 'loginManager')->middleware(['throttle:5,1']);
    });

    Route::post('/carts/loadCart', [App\Http\Controllers\Carts\CartController::class, 'loadCart']);

    Route::middleware(['auth:sanctum', 'auth.session'])->group(function () {
        Route::apiResource('carts', App\Http\Controllers\Carts\CartController::class);

        Route::controller(App\Http\Controllers\Customers\CustomerController::class)->group(function () {
            Route::get('/customers/{id}', 'show');
            Route::put('/customers/{id}', 'edit');
            Route::post('/customers/{id}/change-password', 'changePassword');
        });
    });

    Route::controller(App\Http\Controllers\Bills\BillController::class)->group(function () {
        Route::post('/bills', 'store');
    });

    Route::controller(App\Http\Controllers\Bookings\BookingController::class)->group(function () {
        Route::post('/bookings', 'store');

        Route::middleware(['auth:sanctum', 'auth.session', 'role:Manager|Staff'])->group(function () {
            Route::get('/bookings', 'create');
            Route::get('/bookings/{id}', 'show');
            Route::put('/bookings/{id}', 'update');
        });
    });

    Route::middleware(['auth:sanctum', 'auth.session', 'role:Manager|Staff'])->group(function () {
        Route::resource('/bill-services', App\Http\Controllers\BillServices\BillServicesController::class);
    });

    Route::controller(App\Http\Controllers\Users\UserController::class)->group(function () {
        Route::get('/staff', 'apiIndex');
    });
});

Route::middleware('api')->controller(App\Http\Controllers\Brands\BrandsController::class)->group(function () {
    Route::get('/brands', 'apiIndex');
    Route::get('/brands/{slug}', 'apiShow');
});

Route::middleware('api')->controller(App\Http\Controllers\Categories\CategoriesController::class)->group(function () {
    Route::get('/categories', 'apiIndex');
    Route::get('/categories/{slug}', 'apiShow');
});

Route::middleware('api')->controller(App\Http\Controllers\Products\ProductController::class)->group(function () {
    Route::get('/products/highlighted', 'apiHighlighted');
    Route::get('/products', 'apiIndex');
    Route::get('/products/{slug}', 'apiShow');
});

Route::middleware('api')->controller(App\Http\Controllers\ServicesCollections\ServiceCollectionsContoller::class)->group(function () {
    Route::get('/services-collections/highlighted', 'apiHighlighted');
    Route::get('/services-collections', 'apiIndex');
    Route::get('/services-collections/{slug}', 'apiShow');
});

Route::middleware('api')->controller(App\Http\Controllers\Services\ServiceController::class)->group(function () {
    Route::get('/services/highlighted', 'apiHighlighted');
    Route::get('/services', 'apiIndex');
    Route::get('/services/{slug}', 'apiShow');
});

Route::middleware('api')->controller(App\Http\Controllers\Sitemap\SitemapController::class)->group(function () {
    Route::get('/sitemap', 'apiIndex');
    Route::get('/sitemap/{id}', 'apiShow');
});

Route::middleware('api')->controller(App\Http\Controllers\Slides\SlidesController::class)->group(function () {
    Route::get('/slides', 'apiIndex');
    Route::get('/slides/{slug}', 'apiShow');
});

Route::middleware('api')->controller(App\Http\Controllers\Contacts\ContactsController::class)->group(function () {
    Route::post('/addContacts', 'addContacts');
});

Route::middleware('api')->controller(App\Http\Controllers\Revenue\RevenueController::class)->group(function () {
    Route::get('/revenue/service', 'getRevenueAllServices');
    Route::get('/revenue/service/{id}', 'getRevenueByService');
    Route::get('/revenue/customer/service/{id}', 'getRevenueByCustomer');
    Route::post('/revenue/dateRange/service', 'getRevenueByDateRange');
    //
    Route::get('/revenue/products', 'getRevenueAllProducts');
    Route::get('/revenue/products/{id}', 'getRevenueByProduct');
    Route::get('/revenue/customer/products/{id}', 'getRevenueProductByCustomer');
    Route::post('/revenue/dateRange/products', 'getRevenueByDateRangeProduct');
});