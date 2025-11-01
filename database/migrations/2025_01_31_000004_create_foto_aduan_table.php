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
        Schema::create('foto_aduan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('aduan_id')->constrained('aduan')->onDelete('cascade');
            $table->string('path');
            $table->string('thumbnail_path')->nullable();
            $table->unsignedInteger('file_size')->nullable()->comment('File size in bytes');
            $table->string('mime_type', 50)->nullable();
            $table->unsignedTinyInteger('urutan')->default(1)->comment('Order: 1-3');
            $table->timestamps();
            
            // Indexes
            $table->index('aduan_id', 'idx_aduan_id');
            $table->index('urutan', 'idx_urutan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foto_aduan');
    }
};
