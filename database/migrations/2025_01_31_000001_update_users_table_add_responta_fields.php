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
            // Remove email field (not used in RESPONTA)
            $table->dropUnique(['email']);
            $table->dropColumn('email');
            $table->dropColumn('email_verified_at');
            
            // Add RESPONTA required fields
            $table->string('no_hp', 15)->unique()->after('name');
            $table->text('nik')->after('no_hp'); // Will be encrypted
            
            // Add indexes
            $table->index('no_hp', 'idx_no_hp');
            $table->index('created_at', 'idx_created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Remove RESPONTA fields
            $table->dropIndex('idx_no_hp');
            $table->dropIndex('idx_created_at');
            $table->dropColumn(['no_hp', 'nik']);
            
            // Restore original email fields
            $table->string('email')->unique()->after('name');
            $table->timestamp('email_verified_at')->nullable()->after('email');
        });
    }
};
