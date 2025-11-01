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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // 'super_admin', 'admin_kota', etc
            $table->string('display_name'); // 'Super Admin', 'Admin Kota', etc
            $table->text('description')->nullable();
            $table->integer('level')->default(99); // 1=highest, 99=lowest
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Indexes
            $table->index('name');
            $table->index('level');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
