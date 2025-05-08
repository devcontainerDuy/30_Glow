<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('api')->group(function () {
    Route::get('/provinces', [\App\Http\Controllers\Settings\MapsController::class, 'getProvince']);
    Route::get('/districts/{id}', [\App\Http\Controllers\Settings\MapsController::class, 'getDistrict']);
    Route::get('/wards/{id}', [\App\Http\Controllers\Settings\MapsController::class, 'getWard']);
});
