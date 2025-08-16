<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\DashboardUser;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UtilisateurController;

Route::group(['prefix' => 'auth'], function () {
    // Routes publiques
    Route::post('register', [UserController::class, 'register']);
    Route::post('login', [UserController::class, 'login']);
    Route::post('reset-password-request', [UserController::class, 'forgotPassword']);
    Route::post('reset-password', [UserController::class, 'resetPassword']);


    // Routes protégées
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::group(['middleware' => 'ability:admin,user'], function () {
            Route::get('profile', [UserController::class, 'profile']);
            Route::post('change-password', [UserController::class, 'changePassword']);
            Route::post('update-profile', [UserController::class, 'updateProfile']);
            Route::post('logout', [UserController::class, 'logout']);
        });
    });
});

Route::group(['prefix' => 'admin'], function () {
    Route::resource('utilisateur', UtilisateurController::class);
    Route::resource('category', CategoriesController::class);
});
Route::group(['prefix' => 'user', 'middleware' => ['auth:sanctum']], function () {
    Route::resource('home', DashboardUser::class);
    Route::resource('category', CategoriesController::class);
    Route::resource('transaction', TransactionController::class);
});
