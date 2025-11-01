<?php

namespace Database\Seeders;

use App\Models\KategoriAduan;
use Illuminate\Database\Seeder;

class KategoriAduanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategoris = [
            [
                'nama' => 'Jalan Rusak',
                'slug' => 'jalan-rusak',
                'icon' => 'road-icon.svg',
                'deskripsi' => 'Aduan terkait jalan berlubang, jalan bergelombang, atau kerusakan jalan lainnya',
                'is_active' => true,
            ],
            [
                'nama' => 'Lampu Jalan Mati',
                'slug' => 'lampu-jalan-mati',
                'icon' => 'light-icon.svg',
                'deskripsi' => 'Aduan terkait lampu penerangan jalan umum (PJU) yang mati atau rusak',
                'is_active' => true,
            ],
            [
                'nama' => 'Sampah Menumpuk',
                'slug' => 'sampah-menumpuk',
                'icon' => 'trash-icon.svg',
                'deskripsi' => 'Aduan terkait penumpukan sampah atau TPS yang tidak diangkut',
                'is_active' => true,
            ],
            [
                'nama' => 'Drainase Tersumbat',
                'slug' => 'drainase-tersumbat',
                'icon' => 'drain-icon.svg',
                'deskripsi' => 'Aduan terkait saluran air atau drainase yang tersumbat atau rusak',
                'is_active' => true,
            ],
            [
                'nama' => 'Pohon Tumbang',
                'slug' => 'pohon-tumbang',
                'icon' => 'tree-icon.svg',
                'deskripsi' => 'Aduan terkait pohon tumbang yang menghalangi jalan atau membahayakan',
                'is_active' => true,
            ],
            [
                'nama' => 'Fasilitas Umum Rusak',
                'slug' => 'fasilitas-umum-rusak',
                'icon' => 'facility-icon.svg',
                'deskripsi' => 'Aduan terkait kerusakan fasilitas umum seperti halte, trotoar, taman, dll',
                'is_active' => true,
            ],
            [
                'nama' => 'Banjir / Genangan',
                'slug' => 'banjir-genangan',
                'icon' => 'flood-icon.svg',
                'deskripsi' => 'Aduan terkait banjir atau genangan air di jalan',
                'is_active' => true,
            ],
            [
                'nama' => 'Pencemaran Lingkungan',
                'slug' => 'pencemaran-lingkungan',
                'icon' => 'pollution-icon.svg',
                'deskripsi' => 'Aduan terkait pencemaran udara, air, atau lingkungan lainnya',
                'is_active' => true,
            ],
        ];

        foreach ($kategoris as $kategori) {
            KategoriAduan::create($kategori);
        }

        $this->command->info('✅ KategoriAduan seeded successfully! Total: ' . count($kategoris) . ' categories');
    }
}
