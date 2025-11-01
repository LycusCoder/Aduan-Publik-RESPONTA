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
        Schema::table('aduan', function (Blueprint $table) {
            // Add admin fields
            $table->foreignId('dinas_id')->nullable()->after('kategori_aduan_id')->constrained('dinas')->onDelete('set null');
            $table->foreignId('assigned_to')->nullable()->after('dinas_id')->constrained('users')->onDelete('set null');
            $table->foreignId('verifikator_id')->nullable()->after('assigned_to')->constrained('users')->onDelete('set null');
            $table->foreignId('organization_id')->nullable()->after('verifikator_id')->constrained('organizations')->onDelete('set null');
            
            // Add priority and progress
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium')->after('status');
            $table->integer('progress')->default(0)->after('priority')->comment('Progress 0-100%');
            
            // Add timestamps for workflow
            $table->timestamp('tanggal_verifikasi')->nullable()->after('tanggal_selesai');
            $table->timestamp('tanggal_diproses')->nullable()->after('tanggal_verifikasi');
            
            // Add catatan_penolakan (if doesn't exist) and catatan_verifikasi
            $table->text('catatan_penolakan')->nullable()->after('catatan_admin');
            $table->text('catatan_verifikasi')->nullable()->after('catatan_penolakan');

            // Indexes
            $table->index('dinas_id');
            $table->index('assigned_to');
            $table->index('verifikator_id');
            $table->index('organization_id');
            $table->index('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aduan', function (Blueprint $table) {
            // Drop foreign keys
            $table->dropForeign(['dinas_id']);
            $table->dropForeign(['assigned_to']);
            $table->dropForeign(['verifikator_id']);
            $table->dropForeign(['organization_id']);
            
            // Drop columns
            $table->dropColumn([
                'dinas_id',
                'assigned_to',
                'verifikator_id',
                'organization_id',
                'priority',
                'progress',
                'tanggal_verifikasi',
                'tanggal_diproses',
                'catatan_penolakan',
                'catatan_verifikasi'
            ]);
        });
    }
};
