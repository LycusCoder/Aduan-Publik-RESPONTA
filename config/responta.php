<?php

return [

    /*
    |--------------------------------------------------------------------------
    | OTP Configuration
    |--------------------------------------------------------------------------
    |
    | Enable or disable OTP verification for user registration.
    | When disabled, users will be automatically verified.
    |
    */

    'otp_enabled' => env('OTP_ENABLED', false),

    'otp_length' => 6,

    'otp_expiry_minutes' => 5,

    /*
    |--------------------------------------------------------------------------
    | Authentication Configuration
    |--------------------------------------------------------------------------
    */

    'login_attempts' => 5,

    'login_lockout_minutes' => 15,

    /*
    |--------------------------------------------------------------------------
    | File Upload Configuration
    |--------------------------------------------------------------------------
    */

    'max_photos_per_aduan' => 3,

    'max_photo_size_mb' => 2,

    'allowed_photo_formats' => ['jpeg', 'png', 'jpg'],

    /*
    |--------------------------------------------------------------------------
    | Aduan Configuration
    |--------------------------------------------------------------------------
    */

    'nearby_radius_km' => 5,

    'auto_close_days' => 30,

];
