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
        Schema::create('aduan', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_tiket', 50)->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('kategori_aduan_id')->constrained('kategori_aduan')->onDelete('restrict');
            $table->text('deskripsi');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->text('alamat')->nullable();
            $table->enum('status', ['baru', 'diverifikasi', 'diproses', 'selesai', 'ditolak'])->default('baru');
            $table->text('catatan_admin')->nullable();
            $table->timestamp('tanggal_selesai')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('user_id', 'idx_user_id');
            $table->index('kategori_aduan_id', 'idx_kategori_aduan_id');
            $table->index('status', 'idx_status');
            $table->index('created_at', 'idx_created_at');
            $table->index('nomor_tiket', 'idx_nomor_tiket');
            
            // Spatial index for location-based queries
            // Note: MySQL requires special syntax for spatial indexes
            // For now using regular indexes, can be optimized later
            $table->index(['latitude', 'longitude'], 'idx_location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aduan');
    }
};
