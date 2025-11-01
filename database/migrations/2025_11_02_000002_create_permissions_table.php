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
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // 'view_all_aduan', 'verify_aduan', etc
            $table->string('display_name'); // 'View All Aduan', 'Verify Aduan', etc
            $table->text('description')->nullable();
            $table->string('group')->nullable(); // 'aduan', 'user', 'report', etc
            $table->timestamps();

            // Indexes
            $table->index('name');
            $table->index('group');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
