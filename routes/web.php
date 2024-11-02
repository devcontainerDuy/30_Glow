<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return redirect()->route('admin.home');
});

Route::middleware(['auth', 'auth.session', 'web'])->prefix('admin')->as('admin.')->group(function () {
    Route::name('home')->get('/', function () {
        return Inertia::render('Home');
    });
    // Module User
    Route::resource('users', App\Http\Controllers\Users\UserController::class)->names('user');
    // Module Role
    Route::resource('roles', App\Http\Controllers\Roles\RoleController::class)->names('role');
    Route::post('handleRole/permission/{id}', [App\Http\Controllers\Roles\RoleController::class, 'role_permission']);
    // Module Permission
    Route::resource('permissions', App\Http\Controllers\Permissions\PermissionController::class)->names('permission');
    // Module Customer
    Route::resource('customers', App\Http\Controllers\Customers\CustomerController::class)->names('customers');
    // Module Category
    Route::resource('categories', App\Http\Controllers\Categories\CategoriesController::class)->names('categories');
    //Module Brand
    Route::resource('brands', App\Http\Controllers\Brands\BrandsController::class)->names('brands');
    // Module Product
    Route::resource('products', App\Http\Controllers\Products\ProductController::class)->names('products');
    // Module Gallery
    Route::resource('galleries', App\Http\Controllers\Gallery\GalleryController::class)->names('gallery');
    // Module Service Collection
    Route::resource('service-collections', App\Http\Controllers\ServicesCollections\ServiceCollectionsContoller::class)->names('service_collections');
    // Module Service
    Route::resource('services', App\Http\Controllers\Services\ServiceController::class)->names('service');
    // Module Sitemap
    Route::resource('sitemap', App\Http\Controllers\Sitemap\SitemapController::class)->names('sitemap');
    // Module Slides
    Route::resource('slides', App\Http\Controllers\Slides\SlidesController::class)->names('slides');
    // Module Booking
    Route::resource('bookings', App\Http\Controllers\Bookings\BookingController::class)->names('bookings');
});

Route::middleware('web')->prefix('auth')->as('auth.')->controller(App\Http\Controllers\Auth\AuthenController::class)->group(function () {
    Route::get('login', 'login')->name('login');
    Route::post('login', 'handleLogin')->middleware('throttle:5,1'); // Giới hạn request 5 lần mỗi 1 phút
    Route::get('logout', 'handleLogout')->middleware('auth');
});

Route::group(['prefix' => 'laravel-filemanager', 'middleware' => ['web', 'api']], function () {
    \UniSharp\LaravelFilemanager\Lfm::routes();
});
