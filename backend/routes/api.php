<?php

use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\DashboardUser;
use App\Http\Controllers\PreferenceController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UtilisateurController;
use Illuminate\Support\Facades\Broadcast;

// ==========================
// Authentification
// ==========================
Route::prefix('auth')->group(function () {
    // Routes publiques
    Route::post('register', [UserController::class, 'register']);
    Route::post('login', [UserController::class, 'login']);
    Route::post('forgot-password', [UserController::class, 'forgotPassword']);
    Route::post('verify-code', [UserController::class, 'verifyCode']);
    Route::post('reset-password', [UserController::class, 'resetPassword']);

    // Routes protégées par JWT
    Route::middleware('auth:api')->group(function () {
        Route::get('profile', [UserController::class, 'profile']);
        Route::post('change-password', [UserController::class, 'changePassword']);
        Route::post('update-profile', [UserController::class, 'updateProfile']);
        Route::post('logout', [UserController::class, 'logout']);
        Route::post('refresh', [UserController::class, 'refresh']);
    });
});


// ==========================
// Routes Admin
// ==========================
Route::prefix('admin')->middleware(['auth:api'])->group(function () {
    // Gestion des utilisateurs
    Route::resource('utilisateur', UtilisateurController::class);

    // Gestion des catégories
    Route::resource('category', CategoriesController::class);
});


// ==========================
// Routes Utilisateur connecté
// ==========================
Route::prefix('user')->middleware(['auth:api'])->group(function () {
    // Dashboard
    Route::get('home', [DashboardUser::class, 'index']);

    // Gestion des catégories
    Route::resource('category', CategoriesController::class);

    // Gestion des transactions
    Route::resource('transaction', TransactionController::class);

    // Gestion des budgets
    Route::resource('budgets', BudgetController::class);

    // Préférences utilisateur
    Route::get('preferences', [PreferenceController::class, 'index']);
    Route::post('preferences', [PreferenceController::class, 'store']);
});

Route::middleware('auth:api')->get('/user/notifications', function () {
    $user = auth()->user();
    return \App\Models\Notification::where('user_id', $user->id)
        ->orderByDesc('created_at')
        ->get();
});

Route::middleware('auth:api')->post('/user/notifications/{id}/read', function ($id) {
    $notification = \App\Models\Notification::where('user_id', auth()->id())->findOrFail($id);
    $notification->update(['is_read' => true]);
    return response()->json(['success' => true]);
});

// ==========================
// Broadcast sécurisés (événements en temps réel)
// ==========================
Broadcast::routes(['middleware' => ['auth:api']]);
