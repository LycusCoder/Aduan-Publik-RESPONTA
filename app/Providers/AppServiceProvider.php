<?php

namespace App\Providers;

use App\Models\Aduan;
use App\Models\User;
use App\Policies\AduanPolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register policies
        Gate::policy(Aduan::class, AduanPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }
}
