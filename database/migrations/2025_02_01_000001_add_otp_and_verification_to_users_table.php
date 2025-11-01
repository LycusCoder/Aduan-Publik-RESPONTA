<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('otp_code', 6)->nullable()->after('password');
            $table->timestamp('otp_expires_at')->nullable()->after('otp_code');
            $table->boolean('is_verified')->default(false)->after('otp_expires_at');
            $table->timestamp('verified_at')->nullable()->after('is_verified');
            $table->string('email')->nullable()->after('no_hp')->unique();
            
            // Add index for faster OTP lookups
            $table->index(['otp_code', 'otp_expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['otp_code', 'otp_expires_at']);
            $table->dropColumn([
                'otp_code',
                'otp_expires_at',
                'is_verified',
                'verified_at',
                'email'
            ]);
        });
    }
};
