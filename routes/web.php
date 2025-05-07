<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', App\Http\Controllers\Users\UserController::class);
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
