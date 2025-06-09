<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/file', function () {
    return Inertia::render('file/index');
})->name('file');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', App\Http\Controllers\Users\UserController::class);
    Route::resource('customers', App\Http\Controllers\Customers\CustomerController::class);
    Route::resource('roles', App\Http\Controllers\Roles\RoleController::class);
    Route::resource('permissions', App\Http\Controllers\Permissions\PermissionController::class);
});

Route::group(['prefix' => 'laravel-filemanager', 'middleware' => ['web', 'auth']], function () {
    \UniSharp\LaravelFilemanager\Lfm::routes();
});

// XML Sitemap
Route::get('/sitemap.xml', function () {
    $sitemaps = \App\Models\Sitemap::where('status', 1)->get();
    return response()->view('sitemap.xml', ['items' => $sitemaps])->header('Content-Type', 'application/xml');
})->name('sitemap');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
