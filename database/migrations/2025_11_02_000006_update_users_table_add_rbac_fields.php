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
            // Add RBAC fields
            $table->foreignId('role_id')->nullable()->after('password')->constrained('roles')->onDelete('set null');
            $table->foreignId('organization_id')->nullable()->after('role_id')->constrained('organizations')->onDelete('set null');
            $table->foreignId('dinas_id')->nullable()->after('organization_id')->constrained('dinas')->onDelete('set null');
            $table->boolean('is_admin')->default(false)->after('dinas_id');
            $table->boolean('is_active')->default(true)->after('is_admin');
            $table->timestamp('last_login_at')->nullable()->after('is_active');

            // Indexes
            $table->index('role_id');
            $table->index('organization_id');
            $table->index('dinas_id');
            $table->index('is_admin');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop foreign keys first
            $table->dropForeign(['role_id']);
            $table->dropForeign(['organization_id']);
            $table->dropForeign(['dinas_id']);
            
            // Drop columns
            $table->dropColumn([
                'role_id',
                'organization_id',
                'dinas_id',
                'is_admin',
                'is_active',
                'last_login_at'
            ]);
        });
    }
};
