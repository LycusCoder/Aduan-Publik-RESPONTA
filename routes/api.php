<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\KategoriAduanController;
use App\Http\Controllers\Api\AduanController;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminAduanController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\OrganizationController;
use App\Http\Controllers\Api\Admin\DinasController;

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

// API Version 1
Route::prefix('v1')->group(function () {

    // ========================================
    // PUBLIC ROUTES (No Authentication)
    // ========================================

    // Authentication
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
    Route::post('/login', [AuthController::class, 'login']);

    // Kategori Aduan (Public - untuk registration screen)
    Route::get('/kategori-aduan', [KategoriAduanController::class, 'index']);

    // ========================================
    // PROTECTED ROUTES (Requires Authentication)
    // ========================================

    Route::middleware('auth:sanctum')->group(function () {

        // Profile Management
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Aduan Management (Phase 3)
        Route::get('/aduan', [AduanController::class, 'index']); // List my aduan
        Route::post('/aduan', [AduanController::class, 'store']); // Create aduan
        Route::get('/aduan/{nomor_tiket}', [AduanController::class, 'show']); // Detail aduan
        Route::put('/aduan/{nomor_tiket}', [AduanController::class, 'update']); // Update aduan
        Route::delete('/aduan/{nomor_tiket}', [AduanController::class, 'destroy']); // Delete aduan

    });

    // ========================================
    // ADMIN ROUTES (Phase 5)
    // ========================================

    Route::prefix('admin')->group(function () {
        
        // Admin Authentication (Public)
        Route::post('/login', [AdminAuthController::class, 'login']);

        // Protected Admin Routes
        Route::middleware(['auth:sanctum', 'role:super_admin,admin_kota,kepala_dinas,staf_dinas,camat,staf_kecamatan,lurah,staf_kelurahan,verifikator,teknisi_lapangan'])->group(function () {
            
            // Auth
            Route::post('/logout', [AdminAuthController::class, 'logout']);
            Route::get('/me', [AdminAuthController::class, 'me']);

            // Dashboard
            Route::get('/dashboard', [AdminDashboardController::class, 'index']);
            Route::get('/statistics', [AdminDashboardController::class, 'statistics']);

            // Aduan Management
            Route::get('/aduan', [AdminAduanController::class, 'index']);
            Route::get('/aduan/{id}', [AdminAduanController::class, 'show']);
            Route::put('/aduan/{id}/verify', [AdminAduanController::class, 'verify']);
            Route::put('/aduan/{id}/reject', [AdminAduanController::class, 'reject']);
            Route::put('/aduan/{id}/assign', [AdminAduanController::class, 'assign']);
            Route::put('/aduan/{id}/status', [AdminAduanController::class, 'updateStatus']);
            Route::put('/aduan/{id}/priority', [AdminAduanController::class, 'setPriority']);
            Route::put('/aduan/{id}/progress', [AdminAduanController::class, 'updateProgress']);
            Route::post('/aduan/{id}/notes', [AdminAduanController::class, 'addNotes']);
            Route::get('/aduan/{id}/history', [AdminAduanController::class, 'history']);

            // User Management
            Route::get('/users', [AdminUserController::class, 'index']);
            Route::post('/users', [AdminUserController::class, 'store']);
            Route::get('/users/{id}', [AdminUserController::class, 'show']);
            Route::put('/users/{id}', [AdminUserController::class, 'update']);
            Route::put('/users/{id}/activate', [AdminUserController::class, 'activate']);
            Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
            Route::get('/roles', [AdminUserController::class, 'roles']);

            // Organizations
            Route::get('/organizations', [OrganizationController::class, 'index']);
            Route::get('/organizations/{id}', [OrganizationController::class, 'show']);
            Route::get('/organizations/{id}/tree', [OrganizationController::class, 'tree']);

            // Dinas
            Route::get('/dinas', [DinasController::class, 'index']);
            Route::get('/dinas/{id}', [DinasController::class, 'show']);
            Route::post('/dinas', [DinasController::class, 'store']);
            Route::put('/dinas/{id}', [DinasController::class, 'update']);
            Route::get('/dinas/{id}/staff', [DinasController::class, 'staff']);

        });

    });

});
