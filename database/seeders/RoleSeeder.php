<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'super_admin',
                'display_name' => 'Super Admin',
                'description' => 'Administrator sistem dengan akses penuh ke semua fitur',
                'level' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'admin_kota',
                'display_name' => 'Admin Kota/Kabupaten',
                'description' => 'Administrator level Kota/Kabupaten, koordinasi seluruh wilayah',
                'level' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'kepala_dinas',
                'display_name' => 'Kepala Dinas',
                'description' => 'Kepala dinas teknis (DPU, Dishub, DLH, dll)',
                'level' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'staf_dinas',
                'display_name' => 'Staf Dinas',
                'description' => 'Staf/pegawai dinas teknis',
                'level' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'camat',
                'display_name' => 'Camat',
                'description' => 'Kepala Kecamatan, monitoring aduan di wilayah kecamatannya',
                'level' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'staf_kecamatan',
                'display_name' => 'Staf Kecamatan',
                'description' => 'Staf administrasi kecamatan',
                'level' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'lurah',
                'display_name' => 'Lurah',
                'description' => 'Kepala Kelurahan, monitoring aduan di wilayah kelurahannya',
                'level' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'staf_kelurahan',
                'display_name' => 'Staf Kelurahan',
                'description' => 'Staf administrasi kelurahan',
                'level' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'verifikator',
                'display_name' => 'Verifikator',
                'description' => 'Petugas khusus verifikasi aduan (cek validitas, foto, lokasi)',
                'level' => 9,
                'is_active' => true,
            ],
            [
                'name' => 'teknisi_lapangan',
                'display_name' => 'Teknisi Lapangan',
                'description' => 'Teknisi/pekerja lapangan yang handle perbaikan',
                'level' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'warga',
                'display_name' => 'Warga',
                'description' => 'Masyarakat umum, pembuat aduan',
                'level' => 99,
                'is_active' => true,
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }

        $this->command->info('✅ 11 roles berhasil dibuat!');
    }
}
