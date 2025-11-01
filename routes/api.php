<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\KategoriAduanController;
use App\Http\Controllers\Api\AduanController;

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

});
