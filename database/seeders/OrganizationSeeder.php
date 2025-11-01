<?php

namespace Database\Seeders;

use App\Models\Organization;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Struktur Kota Tegal:
     * - 1 Kota Tegal
     * - 4 Kecamatan
     * - 27 Kelurahan (sample: 2 kelurahan per kecamatan)
     */
    public function run(): void
    {
        // 1. Kota Tegal
        $kotaTegal = Organization::create([
            'parent_id' => null,
            'type' => 'kota',
            'name' => 'Kota Tegal',
            'code' => '3376',
            'address' => 'Jl. Pancasila No. 1, Kota Tegal',
            'phone' => '(0283) 352020',
            'email' => 'pemkot@tegalkota.go.id',
            'is_active' => true,
        ]);

        // 2. Kecamatan
        $kecamatanData = [
            [
                'name' => 'Kecamatan Tegal Barat',
                'code' => '3376010',
                'address' => 'Jl. Werkudara, Tegal Barat',
                'phone' => '(0283) 355123',
            ],
            [
                'name' => 'Kecamatan Tegal Timur',
                'code' => '3376020',
                'address' => 'Jl. Dr. Wahidin, Tegal Timur',
                'phone' => '(0283) 356456',
            ],
            [
                'name' => 'Kecamatan Tegal Selatan',
                'code' => '3376030',
                'address' => 'Jl. HOS Cokroaminoto, Tegal Selatan',
                'phone' => '(0283) 357789',
            ],
            [
                'name' => 'Margadana',
                'code' => '3376040',
                'address' => 'Jl. Veteran, Margadana',
                'phone' => '(0283) 358012',
            ],
        ];

        $kecamatanObjects = [];
        foreach ($kecamatanData as $kec) {
            $kecamatanObjects[] = Organization::create([
                'parent_id' => $kotaTegal->id,
                'type' => 'kecamatan',
                'name' => $kec['name'],
                'code' => $kec['code'],
                'address' => $kec['address'],
                'phone' => $kec['phone'],
                'email' => strtolower(str_replace(['Kecamatan ', ' '], ['', '_'], $kec['name'])) . '@tegalkota.go.id',
                'is_active' => true,
            ]);
        }

        // 3. Kelurahan (sample: 2 kelurahan per kecamatan)
        $kelurahanData = [
            // Tegal Barat
            [
                'kecamatan_idx' => 0,
                'name' => 'Kelurahan Kraton',
                'code' => '3376010001',
                'address' => 'Jl. Kraton Raya',
            ],
            [
                'kecamatan_idx' => 0,
                'name' => 'Kelurahan Mintaragen',
                'code' => '3376010002',
                'address' => 'Jl. Mintaragen',
            ],
            
            // Tegal Timur
            [
                'kecamatan_idx' => 1,
                'name' => 'Kelurahan Bandung',
                'code' => '3376020001',
                'address' => 'Jl. Bandung',
            ],
            [
                'kecamatan_idx' => 1,
                'name' => 'Kelurahan Mangkukusuman',
                'code' => '3376020002',
                'address' => 'Jl. Mangkukusuman',
            ],
            
            // Tegal Selatan
            [
                'kecamatan_idx' => 2,
                'name' => 'Kelurahan Randugunting',
                'code' => '3376030001',
                'address' => 'Jl. Randugunting',
            ],
            [
                'kecamatan_idx' => 2,
                'name' => 'Kelurahan Debong Lor',
                'code' => '3376030002',
                'address' => 'Jl. Debong Lor',
            ],
            
            // Margadana
            [
                'kecamatan_idx' => 3,
                'name' => 'Kelurahan Margadana',
                'code' => '3376040001',
                'address' => 'Jl. Margadana Raya',
            ],
            [
                'kecamatan_idx' => 3,
                'name' => 'Kelurahan Sumurpanggang',
                'code' => '3376040002',
                'address' => 'Jl. Sumurpanggang',
            ],
        ];

        foreach ($kelurahanData as $kel) {
            Organization::create([
                'parent_id' => $kecamatanObjects[$kel['kecamatan_idx']]->id,
                'type' => 'kelurahan',
                'name' => $kel['name'],
                'code' => $kel['code'],
                'address' => $kel['address'],
                'phone' => null,
                'email' => strtolower(str_replace(['Kelurahan ', ' '], ['', '_'], $kel['name'])) . '@tegalkota.go.id',
                'is_active' => true,
            ]);
        }

        $this->command->info('✅ Organizations created:');
        $this->command->info('   - 1 Kota (Kota Tegal)');
        $this->command->info('   - 4 Kecamatan');
        $this->command->info('   - 8 Kelurahan');
        $this->command->info('   Total: 13 organizations');
    }
}
