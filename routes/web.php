<?php

use Illuminate\Support\Facades\Route;

// SPA Routes - All routes handled by React Router
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
