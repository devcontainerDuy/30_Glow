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

Route::middleware(['auth:sanctum', 'web', 'role:Super Admin'])->get('/user/info', [App\Http\Controllers\Users\UserController::class, 'show']);

Route::middleware('api')->group(function () {
    // Auth client
    Route::controller(App\Http\Controllers\Auth\Clients\AuthenticateController::class)->group(function () {
        Route::post('register', 'register');
        Route::post('login', 'login');
        Route::post('logout', 'logout')->middleware('auth:sanctum');
        Route::get('auth/google', 'redirectToAuth')->middleware('web');
        Route::get('auth/google/callback', 'handleAuthCallback')->middleware('web');
    });

    // Reset password
    Route::controller(App\Http\Controllers\Auth\Clients\ResetPasswordController::class)->group(function () {
        Route::post('reset-password', 'sendMail');
        Route::put('reset-password/{token}', 'reset');
    });

    // Auth manager
    Route::controller(App\Http\Controllers\Auth\Admin\AuthenController::class)->group(function () {
        Route::post('login-manager', 'loginManager')->middleware(['throttle:5,1']);
        Route::post('logout-manager', 'handleLogoutManager')->middleware(['auth:sanctum', 'auth.session', 'role:Manager|Staff']);
    });

    // Cart for client not auth
    Route::post('/carts/loadCart', [App\Http\Controllers\Carts\CartController::class, 'loadCart']);

    Route::middleware(['auth:sanctum', 'auth.session', 'check_login'])->group(function () {
        // Cart for client auth
        Route::apiResource('carts', App\Http\Controllers\Carts\CartController::class);

        // Customer
        Route::controller(App\Http\Controllers\Customers\CustomerController::class)->group(function () {
            Route::get('/customers', 'show');
            Route::put('/customers/edit', 'edit');
            Route::post('/customers/change-password', 'changePassword');
        });

        // Comment
        Route::controller(App\Http\Controllers\Comments\CommentsController::class)->group(function () {
            Route::post('/comments', 'addComment');
            // Route::get('/comments/product/{id}', 'getCommentsByProduct');
            // Route::get('/comments/service/{id}', 'getCommentsByService');
        });
    });

    // Bill for client not auth (guest)
    Route::controller(App\Http\Controllers\Bills\BillController::class)->group(function () {
        Route::post('/bills', 'store');
        // Bill for client auth
        Route::middleware(['auth:sanctum', 'auth.session', 'check_login'])->group(function () {
            Route::get('/bills', 'create');
            Route::get('/bills/{id}', 'show');
            Route::delete('/bills/{id}', 'destroy');
            Route::put('/bills/{id}', 'refund');
        });
    });

    // Payment with VnPay
    Route::controller(App\Http\Controllers\Payment\VnPayController::class)->group(function () {
        Route::get('/vnpay/create-payment', 'createPayment');
        Route::get('/vnpay/return-payment', 'vnpayReturn');
    });

    // Booking
    Route::controller(App\Http\Controllers\Bookings\BookingController::class)->group(function () {
        Route::post('/bookings', 'store');
        // Booking for client auth
        Route::middleware(['auth:sanctum', 'auth.session', 'check_login'])->group(function () {
            Route::get('/bookings/customer', 'apiIndex');
            Route::get('/bookings/customer/{id}', 'apiShow');
            Route::delete('/bookings/customer/{id}', 'destroy');
        });

        // Booking for manager and staff
        Route::middleware(['auth:sanctum', 'auth.session', 'role:Manager|Staff'])->group(function () {
            Route::get('/bookings', 'create');
            Route::get('/bookings/{id}', 'show');
            Route::put('/bookings/{id}', 'update');
        });
    });

    // Bill for client auth
    Route::middleware(['auth:sanctum', 'auth.session', 'check_login'])->controller(App\Http\Controllers\BillServices\BillServicesController::class)->group(function () {
        Route::get('/bill-services/customer', 'apiIndex');
        Route::get('/bill-services/customer/{id}', 'apiShow');
    });

    // Manager and Staff
    Route::middleware(['auth:sanctum', 'auth.session', 'role:Manager|Staff|Super Admin'])->group(function () {
        // Bill Services for Manager 
        Route::resource('/bill-services', App\Http\Controllers\BillServices\BillServicesController::class);

        // Info user
        Route::controller(App\Http\Controllers\Users\UserController::class)->group(function () {
            Route::get('/staff', 'apiIndex');
            Route::get('/staff/{id}', 'apiShow');
            Route::get('/manager/infomation', 'apiEdit');
        });
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
    Route::get('/products/search/{value}', 'apiSearch');
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

Route::middleware('api')->controller(App\Http\Controllers\PostsCollections\PostCollectionsController::class)->group(function () {
    Route::get('/posts-collections', 'apiIndex');
    Route::get('/posts-collections/{slug}', 'apiShow');
});

Route::middleware('api')->controller(App\Http\Controllers\Posts\PostController::class)->group(function () {
    Route::get('/posts/highlighted', 'apiHighlighted');
    Route::get('/posts', 'apiIndex');
    Route::get('/posts/{slug}', 'apiShow');
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

Route::middleware(['api', 'auth:sanctum', 'auth.session'])->controller(App\Http\Controllers\Revenue\RevenueController::class)->group(function () {
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
