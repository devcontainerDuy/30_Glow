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

Route::middleware('api')->controller(App\Http\Controllers\Slides\SlidesController::class)->group(function () {
    Route::get('/slides', 'apiIndex');
    Route::get('/slides/{slug}', 'apiShow');
});
